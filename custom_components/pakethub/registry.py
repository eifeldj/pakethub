"""Registry cleanup helpers for PaketHub."""
from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

from .const import CENTRAL_DEVICE_IDENTIFIER, DOMAIN

_LOGGER = logging.getLogger(__name__)


def async_cleanup_orphaned_shipments(
    hass: HomeAssistant,
    entry: ConfigEntry,
    valid_tracking_numbers: set[str],
) -> tuple[int, int]:
    """Remove shipment entities and devices no longer returned by PaketHub."""
    entity_registry = er.async_get(hass)
    device_registry = dr.async_get(hass)

    removed_entities = 0
    removed_devices = 0

    orphaned_devices = []
    for device in list(device_registry.devices.values()):
        if entry.entry_id not in device.config_entries:
            continue

        shipment_identifiers = {
            identifier
            for domain, identifier in device.identifiers
            if domain == DOMAIN and identifier != CENTRAL_DEVICE_IDENTIFIER
        }
        if not shipment_identifiers:
            continue

        if shipment_identifiers.isdisjoint(valid_tracking_numbers):
            orphaned_devices.append(device)

    for device in orphaned_devices:
        entity_ids = [
            entity.entity_id
            for entity in entity_registry.entities.values()
            if entity.device_id == device.id
        ]

        for entity_id in entity_ids:
            entity_registry.async_remove(entity_id)
            removed_entities += 1

        device_registry.async_remove_device(device.id)
        removed_devices += 1

    if removed_entities or removed_devices:
        _LOGGER.info(
            "Cleaned up %s orphaned PaketHub entities and %s devices",
            removed_entities,
            removed_devices,
        )

    return removed_entities, removed_devices
