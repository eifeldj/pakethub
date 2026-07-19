"""Diagnostics support for PaketHub."""
from __future__ import annotations

from collections import Counter
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import CONF_API_KEY, DOMAIN
from .entity import shipment_raw_status


async def async_get_config_entry_diagnostics(hass: HomeAssistant, entry: ConfigEntry) -> dict[str, Any]:
    """Return privacy-conscious diagnostics for a config entry."""
    coordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]
    records = coordinator.data or {}
    statuses = Counter(shipment_raw_status(record) for record in records.values())

    return {
        "config_entry": {
            "title": entry.title,
            "data": {key: "**REDACTED**" if key == CONF_API_KEY else value for key, value in entry.data.items()},
            "options": dict(entry.options),
        },
        "coordinator": {
            "last_update_success": coordinator.last_update_success,
            "last_successful_update": coordinator.last_successful_update,
            "update_interval": str(coordinator.update_interval),
            "shipment_count": len(records),
            "status_counts": dict(statuses),
        },
    }
