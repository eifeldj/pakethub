"""PaketHub integration."""
from __future__ import annotations

import json
import logging
from pathlib import Path

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import CONF_API_KEY, CONF_UPS_CLIENT_ID, CONF_UPS_CLIENT_SECRET, DOMAIN
from .coordinator import PaketHubCoordinator
from .frontend import async_register_frontend
from .providers import ProviderManager, SeventeenTrackProvider, UpsProvider
from .registry import async_cleanup_orphaned_shipments
from .services import async_setup_services

_LOGGER = logging.getLogger(__name__)
PLATFORMS = [Platform.SENSOR, Platform.BINARY_SENSOR, Platform.BUTTON]


def integration_version() -> str:
    """Return the integration version from manifest.json."""
    try:
        data = json.loads(
            Path(__file__).with_name("manifest.json").read_text(encoding="utf-8")
        )
    except (OSError, ValueError, TypeError):
        return "unknown"
    return str(data.get("version", "unknown"))


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up domain-level PaketHub service actions."""
    await async_setup_services(hass)
    await async_register_frontend(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up PaketHub from a config entry."""
    session = async_get_clientsession(hass)
    seventeen_track = SeventeenTrackProvider(session, entry.data[CONF_API_KEY])
    provider_manager = ProviderManager([seventeen_track], default_provider_id="17track")

    ups_client_id = str(entry.options.get(CONF_UPS_CLIENT_ID, "")).strip()
    ups_client_secret = str(entry.options.get(CONF_UPS_CLIENT_SECRET, "")).strip()
    if ups_client_id and ups_client_secret:
        provider_manager.add(UpsProvider(session, ups_client_id, ups_client_secret))

    _LOGGER.info(
        "Starting PaketHub %s with providers: %s",
        integration_version(),
        ", ".join(provider_manager.provider_names),
    )

    coordinator = PaketHubCoordinator(hass, entry, provider_manager)
    await coordinator.async_config_entry_first_refresh()

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {
        "api": seventeen_track,
        "provider_manager": provider_manager,
        "coordinator": coordinator,
        "version": integration_version(),
    }

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    @callback
    def cleanup_orphaned_shipments() -> None:
        async_cleanup_orphaned_shipments(
            hass, entry, set(coordinator.data or {})
        )

    cleanup_orphaned_shipments()
    entry.async_on_unload(coordinator.async_add_listener(cleanup_orphaned_shipments))
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        hass.data[DOMAIN].pop(entry.entry_id, None)
        if not hass.data[DOMAIN]:
            hass.data.pop(DOMAIN, None)
    return unloaded
