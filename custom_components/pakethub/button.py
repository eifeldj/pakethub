"""Button platform for PaketHub."""
from __future__ import annotations

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import DOMAIN
from .coordinator import PaketHubCoordinator
from .entity import PaketHubEntity


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback) -> None:
    coordinator: PaketHubCoordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]
    async_add_entities([PaketHubRefreshButton(coordinator, entry)])


class PaketHubRefreshButton(PaketHubEntity, ButtonEntity):
    """Request an immediate refresh."""

    _attr_translation_key = "refresh"
    _attr_icon = "mdi:refresh"
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, coordinator: PaketHubCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_refresh"

    async def async_press(self) -> None:
        await self.coordinator.async_request_refresh()
