"""Binary sensor platform for PaketHub."""
from __future__ import annotations

from homeassistant.components.binary_sensor import BinarySensorDeviceClass, BinarySensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import DOMAIN
from .coordinator import PaketHubCoordinator
from .entity import PaketHubEntity


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback) -> None:
    coordinator: PaketHubCoordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]
    async_add_entities([PaketHubApiOnlineBinarySensor(coordinator, entry)])


class PaketHubApiOnlineBinarySensor(PaketHubEntity, BinarySensorEntity):
    """Report whether the most recent API update succeeded."""

    _attr_translation_key = "api_online"
    _attr_device_class = BinarySensorDeviceClass.CONNECTIVITY
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, coordinator: PaketHubCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_api_online"

    @property
    def is_on(self) -> bool:
        return self.coordinator.last_update_success
