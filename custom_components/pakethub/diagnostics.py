"""Diagnostics support for PaketHub."""
from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import CONF_SCAN_INTERVAL, DOMAIN


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant,
    entry: ConfigEntry,
) -> dict[str, Any]:
    runtime = hass.data[DOMAIN][entry.entry_id]
    coordinator = runtime["coordinator"]
    provider_manager = runtime["provider_manager"]

    return {
        "integration": {
            "version": runtime.get("version", "unknown"),
            "entry_title": entry.title,
            "scan_interval": entry.options.get(CONF_SCAN_INTERVAL),
        },
        "providers": provider_manager.diagnostics(),
        "runtime": coordinator.diagnostics(),
    }
