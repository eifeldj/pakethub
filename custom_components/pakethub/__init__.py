"""PaketHub integration."""
from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import CONF_API_KEY, DOMAIN
from .coordinator import PaketHubCoordinator
from .frontend import async_register_frontend
from .providers import ProviderManager, SeventeenTrackProvider
from .registry import async_cleanup_orphaned_shipments
from .services import async_setup_services

PLATFORMS = [Platform.SENSOR, Platform.BINARY_SENSOR, Platform.BUTTON]


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up domain-level PaketHub service actions."""
    await async_setup_services(hass)
    await async_register_frontend(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up PaketHub from a config entry."""
    session = async_get_clientsession(hass)
    seventeen_track = SeventeenTrackProvider(session, entry.data[CONF_API_KEY])
    provider_manager = ProviderManager([seventeen_track])
    coordinator = PaketHubCoordinator(hass, entry, provider_manager)

    await coordinator.async_config_entry_first_refresh()

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {
        "api": seventeen_track,
        "provider_manager": provider_manager,
        "coordinator": coordinator,
    }

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    @callback
    def cleanup_orphaned_shipments() -> None:
        """Clean registry entries that no longer have coordinator data."""
        async_cleanup_orphaned_shipments(
            hass,
            entry,
            set(coordinator.data or {}),
        )

    cleanup_orphaned_shipments()
    entry.async_on_unload(
        coordinator.async_add_listener(cleanup_orphaned_shipments)
    )
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload when options change."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        hass.data[DOMAIN].pop(entry.entry_id, None)
        if not hass.data[DOMAIN]:
            hass.data.pop(DOMAIN, None)
    return unloaded
