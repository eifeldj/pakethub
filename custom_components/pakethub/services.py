"""Service actions for PaketHub."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry, ConfigEntryState
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
import homeassistant.helpers.config_validation as cv

from .api import PaketHubApiError
from .const import (
    ATTR_CARRIER,
    ATTR_PACKAGE_NAME,
    ATTR_TRACKING_NUMBER,
    DOMAIN,
    SERVICE_ADD_PACKAGE,
    SERVICE_REFRESH,
    SERVICE_RENAME_PACKAGE,
    SERVICE_REMOVE_PACKAGE,
)

_LOGGER = logging.getLogger(__name__)

ADD_PACKAGE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_TRACKING_NUMBER): cv.string,
        vol.Required(ATTR_PACKAGE_NAME): cv.string,
    }
)

RENAME_PACKAGE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_TRACKING_NUMBER): cv.string,
        vol.Required(ATTR_PACKAGE_NAME): cv.string,
        vol.Optional(ATTR_CARRIER): vol.Coerce(int),
    }
)

REMOVE_PACKAGE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_TRACKING_NUMBER): cv.string,
        vol.Optional(ATTR_CARRIER): vol.Coerce(int),
    }
)


def _get_runtime(
    hass: HomeAssistant,
) -> tuple[ConfigEntry, dict[str, Any]]:
    """Return the loaded PaketHub entry and its runtime data."""
    loaded_entries = [
        entry
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.state is ConfigEntryState.LOADED
    ]

    if not loaded_entries:
        raise ServiceValidationError(
            "PaketHub ist nicht eingerichtet oder aktuell nicht geladen."
        )

    entry = loaded_entries[0]
    runtime = hass.data.get(DOMAIN, {}).get(entry.entry_id)

    if not runtime:
        raise ServiceValidationError(
            "Für PaketHub sind keine Laufzeitdaten verfügbar."
        )

    return entry, runtime


def _remove_shipment_from_registries(
    hass: HomeAssistant,
    tracking_number: str,
) -> int:
    """Remove all entities and the device belonging to a shipment."""
    entity_registry = er.async_get(hass)
    device_registry = dr.async_get(hass)

    device = device_registry.async_get_device(
        identifiers={(DOMAIN, tracking_number)}
    )

    if device is None:
        _LOGGER.debug(
            "No device registry entry found for shipment %s",
            tracking_number,
        )
        return 0

    entity_ids = [
        entity.entity_id
        for entity in entity_registry.entities.values()
        if entity.device_id == device.id
    ]

    for entity_id in entity_ids:
        entity_registry.async_remove(entity_id)

    device_registry.async_remove_device(device.id)

    _LOGGER.info(
        "Removed shipment %s from device registry together with %s entities",
        tracking_number,
        len(entity_ids),
    )

    return len(entity_ids)


async def async_setup_services(hass: HomeAssistant) -> None:
    """Register PaketHub service actions once."""

    async def async_add_package(call: ServiceCall) -> dict[str, Any]:
        _entry, runtime = _get_runtime(hass)
        api = runtime["api"]
        coordinator = runtime["coordinator"]

        tracking_number = call.data[ATTR_TRACKING_NUMBER].strip()
        package_name = call.data[ATTR_PACKAGE_NAME].strip()

        if not tracking_number:
            raise ServiceValidationError("Die Sendungsnummer darf nicht leer sein.")
        if not package_name:
            raise ServiceValidationError("Der Paketname darf nicht leer sein.")

        try:
            response = await api.async_register(tracking_number, package_name)
            accepted = response.get("data", {}).get("accepted", [])
            rejected = response.get("data", {}).get("rejected", [])

            if rejected and not accepted:
                first_rejection = rejected[0]
                error_data = first_rejection.get("error") or first_rejection
                error_code = (
                    error_data.get("code")
                    if isinstance(error_data, dict)
                    else None
                )

                # 17TRACK code -18019901 means the shipment already exists.
                if error_code == -18019901:
                    await coordinator.async_request_refresh()
                    return {
                        "success": True,
                        "already_registered": True,
                        "tracking_number": tracking_number,
                        "package_name": package_name,
                        "accepted": accepted,
                        "rejected": rejected,
                    }

                raise ServiceValidationError(
                    f"17TRACK hat die Sendung abgelehnt: {error_data}"
                )

            await coordinator.async_request_refresh()
            return {
                "success": True,
                "tracking_number": tracking_number,
                "package_name": package_name,
                "accepted": accepted,
                "rejected": rejected,
            }
        except ServiceValidationError:
            raise
        except PaketHubApiError as err:
            raise HomeAssistantError(
                f"Die Sendung konnte nicht registriert werden: {err}"
            ) from err

    async def async_rename_package(call: ServiceCall) -> dict[str, Any]:
        _entry, runtime = _get_runtime(hass)
        api = runtime["api"]
        coordinator = runtime["coordinator"]

        tracking_number = call.data[ATTR_TRACKING_NUMBER].strip()
        package_name = call.data[ATTR_PACKAGE_NAME].strip()
        carrier = call.data.get(ATTR_CARRIER)

        if not tracking_number or not package_name:
            raise ServiceValidationError(
                "Sendungsnummer und Paketname dürfen nicht leer sein."
            )

        try:
            response = await api.async_change_tag(
                tracking_number,
                package_name,
                carrier,
            )
            accepted = response.get("data", {}).get("accepted", [])
            rejected = response.get("data", {}).get("rejected", [])

            if rejected and not accepted:
                reason = rejected[0].get("error") or rejected[0]
                raise ServiceValidationError(
                    f"17TRACK hat die Umbenennung abgelehnt: {reason}"
                )

            await coordinator.async_request_refresh()
            return {
                "success": True,
                "tracking_number": tracking_number,
                "package_name": package_name,
            }
        except ServiceValidationError:
            raise
        except PaketHubApiError as err:
            raise HomeAssistantError(
                f"Die Sendung konnte nicht umbenannt werden: {err}"
            ) from err

    async def async_remove_package(call: ServiceCall) -> dict[str, Any]:
        entry, runtime = _get_runtime(hass)
        api = runtime["api"]
        coordinator = runtime["coordinator"]

        tracking_number = call.data[ATTR_TRACKING_NUMBER].strip()
        carrier = call.data.get(ATTR_CARRIER)

        if not tracking_number:
            raise ServiceValidationError("Die Sendungsnummer darf nicht leer sein.")

        try:
            response = await api.async_delete(tracking_number, carrier)
            accepted = response.get("data", {}).get("accepted", [])
            rejected = response.get("data", {}).get("rejected", [])

            if rejected and not accepted:
                reason = rejected[0].get("error") or rejected[0]
                raise ServiceValidationError(
                    f"17TRACK hat das Löschen abgelehnt: {reason}"
                )

            await coordinator.async_request_refresh()

            removed_entities = _remove_shipment_from_registries(
                hass,
                tracking_number,
            )

            # Reload the integration so removed in-memory shipment entities
            # disappear immediately and cannot recreate registry entries.
            await hass.config_entries.async_reload(entry.entry_id)

            return {
                "success": True,
                "tracking_number": tracking_number,
                "accepted": accepted,
                "rejected": rejected,
                "removed_entities": removed_entities,
            }
        except ServiceValidationError:
            raise
        except PaketHubApiError as err:
            raise HomeAssistantError(
                f"Die Sendung konnte nicht gelöscht werden: {err}"
            ) from err

    async def async_refresh(call: ServiceCall) -> dict[str, Any]:
        _entry, runtime = _get_runtime(hass)
        coordinator = runtime["coordinator"]

        await coordinator.async_request_refresh()
        return {
            "success": coordinator.last_update_success,
            "shipments": len(coordinator.data or {}),
        }

    hass.services.async_register(
        DOMAIN,
        SERVICE_ADD_PACKAGE,
        async_add_package,
        schema=ADD_PACKAGE_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_RENAME_PACKAGE,
        async_rename_package,
        schema=RENAME_PACKAGE_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_REMOVE_PACKAGE,
        async_remove_package,
        schema=REMOVE_PACKAGE_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_REFRESH,
        async_refresh,
        supports_response=SupportsResponse.OPTIONAL,
    )

    _LOGGER.info("PaketHub service actions registered")
