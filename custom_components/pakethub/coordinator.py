"""Data coordinator for PaketHub."""
from __future__ import annotations

from collections import Counter, defaultdict
from datetime import UTC, datetime, timedelta
import logging
from time import monotonic
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import API_PAGE_SIZE, CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL, DOMAIN
from .providers import (
    PaketHubProviderAuthenticationError,
    PaketHubProviderError,
    ProviderManager,
)

_LOGGER = logging.getLogger(__name__)


class PaketHubCoordinator(DataUpdateCoordinator[dict[str, dict[str, Any]]]):
    """Fetch all registered shipments and their full tracking details."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        provider_manager: ProviderManager,
    ) -> None:
        self.entry = entry
        self.provider_manager = provider_manager
        self.default_provider = provider_manager.default_provider
        self.last_successful_update: datetime | None = None
        self.provider_usage: Counter[str] = Counter()
        self.provider_fallbacks: Counter[str] = Counter()
        self.provider_call_count: Counter[str] = Counter()
        self.provider_total_duration_ms: defaultdict[str, float] = defaultdict(float)
        self.last_update_duration_ms: float | None = None
        minutes = int(entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL))

        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(minutes=minutes),
            always_update=False,
        )

    async def _async_update_data(self) -> dict[str, dict[str, Any]]:
        started = monotonic()
        try:
            summaries = await self._async_load_registered_shipments()
            result = await self._async_load_tracking_details(summaries)
            self._add_shipments_without_details(result, summaries)
            self.last_successful_update = datetime.now(UTC)
            self.last_update_duration_ms = round((monotonic() - started) * 1000, 1)
            _LOGGER.debug(
                "PaketHub refresh completed: %d shipments in %.1f ms; usage=%s; fallbacks=%s",
                len(result),
                self.last_update_duration_ms,
                dict(self.provider_usage),
                dict(self.provider_fallbacks),
            )
            return result
        except PaketHubProviderAuthenticationError as err:
            raise ConfigEntryAuthFailed from err
        except PaketHubProviderError as err:
            raise UpdateFailed(
                f"{self.default_provider.provider_name} API error: {err}"
            ) from err

    async def _timed_provider_call(
        self, provider: Any, method_name: str, *args: Any
    ) -> Any:
        started = monotonic()
        try:
            return await getattr(provider, method_name)(*args)
        finally:
            duration_ms = (monotonic() - started) * 1000
            provider_id = provider.provider_id
            self.provider_call_count[provider_id] += 1
            self.provider_total_duration_ms[provider_id] += duration_ms
            _LOGGER.debug(
                "%s.%s completed in %.1f ms",
                provider.provider_name,
                method_name,
                duration_ms,
            )

    async def _async_load_registered_shipments(self) -> list[dict[str, Any]]:
        summaries: list[dict[str, Any]] = []
        page_no = 1
        while True:
            response = await self._timed_provider_call(
                self.default_provider, "async_get_track_list", page_no
            )
            page = response.get("page", {})
            accepted = response.get("data", {}).get("accepted", [])
            summaries.extend(item for item in accepted if isinstance(item, dict))
            if not page.get("has_next"):
                break
            page_no += 1
            if page_no > 100:
                _LOGGER.warning("Stopped after 100 pages to avoid an endless loop")
                break
        return summaries

    async def _async_load_tracking_details(
        self, summaries: list[dict[str, Any]]
    ) -> dict[str, dict[str, Any]]:
        result: dict[str, dict[str, Any]] = {}
        summaries_by_number = self._index_summaries_by_number(summaries)
        fallback_summaries: list[dict[str, Any]] = []

        for summary in summaries:
            number = summary.get("number")
            if not number:
                continue

            provider = self.provider_manager.resolve_tracking_provider(str(number))
            if provider is None or provider is self.default_provider:
                self.provider_usage[self.default_provider.provider_id] += 1
                _LOGGER.debug(
                    "Tracking %s with registry provider %s",
                    number,
                    self.default_provider.provider_name,
                )
                fallback_summaries.append(summary)
                continue

            _LOGGER.debug("Tracking %s with native provider %s", number, provider.provider_name)
            try:
                response = await self._timed_provider_call(
                    provider, "async_get_track_info", [summary]
                )
                accepted = response.get("data", {}).get("accepted", [])
                detail = accepted[0] if accepted else None
                if not isinstance(detail, dict):
                    raise PaketHubProviderError(
                        f"{provider.provider_name} returned no tracking details"
                    )
            except PaketHubProviderError as err:
                fallback_key = f"{provider.provider_id}->{self.default_provider.provider_id}"
                self.provider_fallbacks[fallback_key] += 1
                self.provider_usage[self.default_provider.provider_id] += 1
                _LOGGER.warning(
                    "%s tracking failed for %s; falling back to %s: %s",
                    provider.provider_name,
                    number,
                    self.default_provider.provider_name,
                    err,
                )
                fallback_summaries.append(summary)
                continue

            self.provider_usage[provider.provider_id] += 1
            result[str(number)] = {
                "summary": summary,
                "detail": detail,
                "tracking_provider": provider.provider_id,
            }

        await self._async_load_default_provider_details(
            fallback_summaries, summaries_by_number, result
        )
        return result

    async def _async_load_default_provider_details(
        self,
        summaries: list[dict[str, Any]],
        summaries_by_number: dict[str, dict[str, Any]],
        result: dict[str, dict[str, Any]],
    ) -> None:
        for start in range(0, len(summaries), API_PAGE_SIZE):
            batch = summaries[start : start + API_PAGE_SIZE]
            response = await self._timed_provider_call(
                self.default_provider, "async_get_track_info", batch
            )
            details = response.get("data", {}).get("accepted", [])
            for detail in details:
                if not isinstance(detail, dict):
                    continue
                number = detail.get("number")
                if not number:
                    continue
                result[str(number)] = {
                    "summary": summaries_by_number.get(str(number), {}),
                    "detail": detail,
                    "tracking_provider": self.default_provider.provider_id,
                }

    @staticmethod
    def _index_summaries_by_number(
        summaries: list[dict[str, Any]],
    ) -> dict[str, dict[str, Any]]:
        indexed: dict[str, dict[str, Any]] = {}
        for summary in summaries:
            number = summary.get("number")
            if number:
                indexed.setdefault(str(number), summary)
        return indexed

    @staticmethod
    def _add_shipments_without_details(
        result: dict[str, dict[str, Any]],
        summaries: list[dict[str, Any]],
    ) -> None:
        for summary in summaries:
            number = summary.get("number")
            if number and str(number) not in result:
                result[str(number)] = {"summary": summary, "detail": {}}

    @property
    def average_provider_duration_ms(self) -> dict[str, float]:
        return {
            provider_id: round(
                self.provider_total_duration_ms[provider_id] / call_count, 1
            )
            for provider_id, call_count in self.provider_call_count.items()
            if call_count
        }

    def diagnostics(self) -> dict[str, Any]:
        return {
            "last_successful_update": (
                self.last_successful_update.isoformat()
                if self.last_successful_update
                else None
            ),
            "last_update_duration_ms": self.last_update_duration_ms,
            "shipment_count": len(self.data or {}),
            "provider_usage": dict(self.provider_usage),
            "provider_fallbacks": dict(self.provider_fallbacks),
            "provider_call_count": dict(self.provider_call_count),
            "average_provider_duration_ms": self.average_provider_duration_ms,
        }
