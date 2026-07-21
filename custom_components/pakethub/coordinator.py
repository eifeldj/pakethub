"""Data coordinator for PaketHub."""
from __future__ import annotations

from datetime import UTC, datetime, timedelta
import logging
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
        self.default_provider = provider_manager.get("17track")
        self.last_successful_update: datetime | None = None
        minutes = int(entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL))

        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(minutes=minutes),
            always_update=False,
        )

    async def _async_update_data(self) -> dict[str, dict[str, Any]]:
        try:
            summaries = await self._async_load_registered_shipments()
            result = await self._async_load_tracking_details(summaries)
            self._add_shipments_without_details(result, summaries)

            self.last_successful_update = datetime.now(UTC)
            return result

        except PaketHubProviderAuthenticationError as err:
            raise ConfigEntryAuthFailed from err
        except PaketHubProviderError as err:
            raise UpdateFailed(
                f"{self.default_provider.provider_name} API error: {err}"
            ) from err

    async def _async_load_registered_shipments(self) -> list[dict[str, Any]]:
        """Load all shipment summaries from the registry provider."""
        summaries: list[dict[str, Any]] = []
        page_no = 1

        while True:
            response = await self.default_provider.async_get_track_list(page_no)
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
        self,
        summaries: list[dict[str, Any]],
    ) -> dict[str, dict[str, Any]]:
        """Load and combine tracking details for registered shipments."""
        result: dict[str, dict[str, Any]] = {}
        summaries_by_number = self._index_summaries_by_number(summaries)

        for start in range(0, len(summaries), API_PAGE_SIZE):
            batch = summaries[start : start + API_PAGE_SIZE]
            details_response = await self.default_provider.async_get_track_info(batch)
            details = details_response.get("data", {}).get("accepted", [])

            for detail in details:
                if not isinstance(detail, dict):
                    continue

                number = detail.get("number")
                if not number:
                    continue

                result[number] = {
                    "summary": summaries_by_number.get(number, {}),
                    "detail": detail,
                }

        return result

    @staticmethod
    def _index_summaries_by_number(
        summaries: list[dict[str, Any]],
    ) -> dict[str, dict[str, Any]]:
        """Index the first summary for each tracking number."""
        indexed: dict[str, dict[str, Any]] = {}
        for summary in summaries:
            number = summary.get("number")
            if number:
                indexed.setdefault(number, summary)
        return indexed

    @staticmethod
    def _add_shipments_without_details(
        result: dict[str, dict[str, Any]],
        summaries: list[dict[str, Any]],
    ) -> None:
        """Keep registered shipments even when no detail response was returned."""
        for summary in summaries:
            number = summary.get("number")
            if number and number not in result:
                result[number] = {"summary": summary, "detail": {}}
