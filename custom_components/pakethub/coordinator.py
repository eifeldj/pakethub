"""Data coordinator for PaketHub."""
from __future__ import annotations

from datetime import timedelta
import logging
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.update_coordinator import (
    DataUpdateCoordinator,
    UpdateFailed,
)

from .api import (
    PaketHubApi,
    PaketHubApiError,
    PaketHubAuthenticationError,
)
from .const import API_PAGE_SIZE, CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL, DOMAIN

_LOGGER = logging.getLogger(__name__)


class PaketHubCoordinator(DataUpdateCoordinator[dict[str, dict[str, Any]]]):
    """Fetch all registered shipments and their full tracking details."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        api: PaketHubApi,
    ) -> None:
        self.entry = entry
        self.api = api
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
            summaries: list[dict[str, Any]] = []
            page_no = 1

            while True:
                response = await self.api.async_get_track_list(page_no)
                page = response.get("page", {})
                accepted = response.get("data", {}).get("accepted", [])
                summaries.extend(item for item in accepted if isinstance(item, dict))

                if not page.get("has_next"):
                    break

                page_no += 1
                if page_no > 100:
                    _LOGGER.warning("Stopped after 100 pages to avoid an endless loop")
                    break

            result: dict[str, dict[str, Any]] = {}

            for start in range(0, len(summaries), API_PAGE_SIZE):
                batch = summaries[start : start + API_PAGE_SIZE]
                details_response = await self.api.async_get_track_info(batch)
                details = details_response.get("data", {}).get("accepted", [])

                for detail in details:
                    if not isinstance(detail, dict):
                        continue
                    number = detail.get("number")
                    if not number:
                        continue
                    summary = next(
                        (item for item in batch if item.get("number") == number),
                        {},
                    )
                    result[number] = {
                        "summary": summary,
                        "detail": detail,
                    }

            # Preserve summaries even when detail retrieval rejects one parcel.
            for summary in summaries:
                number = summary.get("number")
                if number and number not in result:
                    result[number] = {"summary": summary, "detail": {}}

            return result

        except PaketHubAuthenticationError as err:
            raise ConfigEntryAuthFailed from err
        except PaketHubApiError as err:
            raise UpdateFailed(f"17TRACK API error: {err}") from err
