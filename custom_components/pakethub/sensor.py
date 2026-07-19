"""Sensor platform for PaketHub."""
from __future__ import annotations

from datetime import date, datetime
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity, SensorStateClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfTime
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import DOMAIN
from .coordinator import PaketHubCoordinator
from .entity import PaketHubEntity, PaketHubShipmentEntity, shipment_raw_status

STATUS_TRANSLATIONS = {
    "NotFound": "Nicht gefunden",
    "InfoReceived": "Elektronisch angekündigt",
    "InTransit": "Unterwegs",
    "Expired": "Abgelaufen",
    "AvailableForPickup": "Zur Abholung bereit",
    "OutForDelivery": "In Zustellung",
    "DeliveryFailure": "Zustellung fehlgeschlagen",
    "Delivered": "Zugestellt",
    "Exception": "Ausnahme",
    "Unknown": "Unbekannt",
}

STATUS_ICONS = {
    "NotFound": "mdi:package-variant-remove",
    "InfoReceived": "mdi:package-variant",
    "InTransit": "mdi:truck-fast-outline",
    "Expired": "mdi:package-variant-closed-minus",
    "AvailableForPickup": "mdi:package-up",
    "OutForDelivery": "mdi:truck-delivery-outline",
    "DeliveryFailure": "mdi:package-variant-closed-remove",
    "Delivered": "mdi:package-variant-closed-check",
    "Exception": "mdi:alert-circle-outline",
    "Unknown": "mdi:package-variant-closed",
}

IN_TRANSIT_STATUSES = {"InTransit", "OutForDelivery", "AvailableForPickup"}
EXCEPTION_STATUSES = {"Exception", "DeliveryFailure", "Expired"}
INACTIVE_STATUSES = {"Delivered", "Expired"}


def _parse_datetime(value: Any) -> datetime | None:
    if not isinstance(value, str) or not value:
        return None
    parsed = dt_util.parse_datetime(value)
    if parsed is None:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=dt_util.UTC)
    return parsed


def _parse_date(value: Any) -> date | None:
    if not isinstance(value, str) or not value:
        return None
    try:
        return date.fromisoformat(value[:10])
    except ValueError:
        return None


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback) -> None:
    coordinator: PaketHubCoordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]

    async_add_entities(
        [
            PaketHubTotalPackagesSensor(coordinator, entry),
            PaketHubActivePackagesSensor(coordinator, entry),
            PaketHubInTransitPackagesSensor(coordinator, entry),
            PaketHubDeliveredPackagesSensor(coordinator, entry),
            PaketHubExceptionPackagesSensor(coordinator, entry),
            PaketHubLastSyncSensor(coordinator, entry),
        ]
    )

    added_numbers: set[str] = set()

    @callback
    def add_missing_shipments() -> None:
        numbers = sorted(set(coordinator.data or {}) - added_numbers)
        if not numbers:
            return
        entities: list[SensorEntity] = []
        for number in numbers:
            entities.extend(
                (
                    PaketHubStatusSensor(coordinator, entry, number),
                    PaketHubLocationSensor(coordinator, entry, number),
                    PaketHubLatestEventSensor(coordinator, entry, number),
                    PaketHubLastUpdateSensor(coordinator, entry, number),
                    PaketHubEtaSensor(coordinator, entry, number),
                    PaketHubDaysInTransitSensor(coordinator, entry, number),
                    PaketHubCarrierSensor(coordinator, entry, number),
                )
            )
        async_add_entities(entities)
        added_numbers.update(numbers)

    add_missing_shipments()
    entry.async_on_unload(coordinator.async_add_listener(add_missing_shipments))


class PaketHubSummarySensor(PaketHubEntity, SensorEntity):
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, coordinator, entry, key: str, translation_key: str, icon: str) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_{key}"
        self._attr_translation_key = translation_key
        self._attr_icon = icon


class PaketHubTotalPackagesSensor(PaketHubSummarySensor):
    def __init__(self, coordinator, entry):
        super().__init__(coordinator, entry, "total_packages", "total_packages", "mdi:package-variant-closed")
    @property
    def native_value(self) -> int:
        return len(self.coordinator.data or {})


class PaketHubActivePackagesSensor(PaketHubSummarySensor):
    def __init__(self, coordinator, entry):
        super().__init__(coordinator, entry, "active_packages", "active_packages", "mdi:package-variant")
    @property
    def native_value(self) -> int:
        return sum(shipment_raw_status(r) not in INACTIVE_STATUSES for r in (self.coordinator.data or {}).values())


class PaketHubInTransitPackagesSensor(PaketHubSummarySensor):
    def __init__(self, coordinator, entry):
        super().__init__(coordinator, entry, "in_transit_packages", "in_transit_packages", "mdi:truck-fast-outline")
    @property
    def native_value(self) -> int:
        return sum(shipment_raw_status(r) in IN_TRANSIT_STATUSES for r in (self.coordinator.data or {}).values())


class PaketHubDeliveredPackagesSensor(PaketHubSummarySensor):
    def __init__(self, coordinator, entry):
        super().__init__(coordinator, entry, "delivered_packages", "delivered_packages", "mdi:package-variant-closed-check")
    @property
    def native_value(self) -> int:
        return sum(shipment_raw_status(r) == "Delivered" for r in (self.coordinator.data or {}).values())


class PaketHubExceptionPackagesSensor(PaketHubSummarySensor):
    def __init__(self, coordinator, entry):
        super().__init__(coordinator, entry, "exception_packages", "exception_packages", "mdi:alert-circle-outline")
    @property
    def native_value(self) -> int:
        return sum(shipment_raw_status(r) in EXCEPTION_STATUSES for r in (self.coordinator.data or {}).values())


class PaketHubLastSyncSensor(PaketHubEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_icon = "mdi:cloud-sync-outline"
    _attr_translation_key = "last_sync"
    def __init__(self, coordinator, entry):
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_last_sync"
    @property
    def native_value(self) -> datetime | None:
        return self.coordinator.last_successful_update


class PaketHubShipmentSensor(PaketHubShipmentEntity, SensorEntity):
    def __init__(self, coordinator, entry, tracking_number, sensor_key, translation_key):
        super().__init__(coordinator, entry, tracking_number)
        self._attr_translation_key = translation_key
        self._attr_unique_id = (
            f"{entry.entry_id}_{tracking_number}" if sensor_key == "status"
            else f"{entry.entry_id}_{tracking_number}_{sensor_key}"
        )


class PaketHubStatusSensor(PaketHubShipmentSensor):
    def __init__(self, coordinator, entry, tracking_number):
        super().__init__(coordinator, entry, tracking_number, "status", "status")
    @property
    def native_value(self) -> str:
        return STATUS_TRANSLATIONS.get(self.raw_status, self.raw_status)
    @property
    def icon(self) -> str:
        return STATUS_ICONS.get(self.raw_status, STATUS_ICONS["Unknown"])
    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {"tracking_number": self._tracking_number, "package_name": self.package_name, "raw_status": self.raw_status, "history": self.history}


class PaketHubLocationSensor(PaketHubShipmentSensor):
    _attr_icon = "mdi:map-marker"
    def __init__(self, coordinator, entry, tracking_number):
        super().__init__(coordinator, entry, tracking_number, "location", "location")
    @property
    def native_value(self) -> str | None:
        return self.event_location(self.latest_event_data)


class PaketHubLatestEventSensor(PaketHubShipmentSensor):
    _attr_icon = "mdi:message-text-clock-outline"
    def __init__(self, coordinator, entry, tracking_number):
        super().__init__(coordinator, entry, tracking_number, "latest_event", "latest_event")
    @property
    def native_value(self) -> str | None:
        translated = self.latest_event_data.get("description_translation") or {}
        return translated.get("description") or self.latest_event_data.get("description") or self.summary.get("latest_event_info")


class PaketHubLastUpdateSensor(PaketHubShipmentSensor):
    _attr_icon = "mdi:clock-outline"
    _attr_device_class = SensorDeviceClass.TIMESTAMP
    def __init__(self, coordinator, entry, tracking_number):
        super().__init__(coordinator, entry, tracking_number, "last_update", "last_update")
    @property
    def native_value(self) -> datetime | None:
        return _parse_datetime(self.latest_event_data.get("time_iso") or self.summary.get("latest_event_time"))


class PaketHubEtaSensor(PaketHubShipmentSensor):
    _attr_icon = "mdi:calendar-clock"
    _attr_device_class = SensorDeviceClass.DATE
    def __init__(self, coordinator, entry, tracking_number):
        super().__init__(coordinator, entry, tracking_number, "eta", "eta")
    @property
    def delivery_window(self) -> dict[str, Any]:
        return self.track_info.get("time_metrics", {}).get("estimated_delivery_date", {}) or {}
    @property
    def native_value(self) -> date | None:
        return _parse_date(self.delivery_window.get("from") or self.delivery_window.get("to"))
    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {"estimated_delivery_from": self.delivery_window.get("from"), "estimated_delivery_to": self.delivery_window.get("to")}


class PaketHubDaysInTransitSensor(PaketHubShipmentSensor):
    _attr_icon = "mdi:timer-sand"
    _attr_native_unit_of_measurement = UnitOfTime.DAYS
    _attr_state_class = SensorStateClass.MEASUREMENT
    def __init__(self, coordinator, entry, tracking_number):
        super().__init__(coordinator, entry, tracking_number, "days_in_transit", "days_in_transit")
    @property
    def native_value(self) -> int | None:
        value = self.track_info.get("time_metrics", {}).get("days_of_transit")
        if value is None:
            value = self.summary.get("days_of_transit")
        try:
            return int(value) if value is not None else None
        except (TypeError, ValueError):
            return None


class PaketHubCarrierSensor(PaketHubShipmentSensor):
    _attr_icon = "mdi:truck-delivery-outline"
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    def __init__(self, coordinator, entry, tracking_number):
        super().__init__(coordinator, entry, tracking_number, "carrier", "carrier")
    @property
    def native_value(self) -> str | None:
        return self.carrier_name
    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {
            "carrier_code": self.detail.get("carrier") or self.summary.get("carrier"),
            "shipping_country": self.summary.get("shipping_country"),
            "recipient_country": self.summary.get("recipient_country"),
        }
