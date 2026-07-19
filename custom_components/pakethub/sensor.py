"""Sensor platform for PaketHub."""
from __future__ import annotations

from datetime import date, datetime, timedelta
from statistics import mean
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity, SensorStateClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import PERCENTAGE, UnitOfTime
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import DOMAIN
from .coordinator import PaketHubCoordinator
from .entity import (
    PaketHubEntity,
    PaketHubShipmentEntity,
    parse_api_datetime,
    shipment_latest_event,
    shipment_raw_status,
)

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

# Conservative progress values. They visualize the state and are not a carrier ETA.
STATUS_PROGRESS = {
    "NotFound": 0,
    "Unknown": 0,
    "InfoReceived": 10,
    "InTransit": 55,
    "Exception": 55,
    "DeliveryFailure": 70,
    "AvailableForPickup": 90,
    "OutForDelivery": 90,
    "Expired": 0,
    "Delivered": 100,
}

IN_TRANSIT_STATUSES = {"InTransit", "OutForDelivery", "AvailableForPickup"}
EXCEPTION_STATUSES = {"Exception", "DeliveryFailure", "Expired"}
INACTIVE_STATUSES = {"Delivered", "Expired"}


def _parse_date(value: Any) -> date | None:
    if not isinstance(value, str) or not value:
        return None
    try:
        return date.fromisoformat(value[:10])
    except ValueError:
        return None


def _record_days_in_transit(record: dict[str, Any]) -> int | None:
    summary = record.get("summary", {}) or {}
    detail = record.get("detail", {}) or {}
    track_info = detail.get("track_info", {}) or {}
    value = track_info.get("time_metrics", {}).get("days_of_transit")
    if value is None:
        value = summary.get("days_of_transit")
    try:
        return int(value) if value is not None else None
    except (TypeError, ValueError):
        return None


def _record_timestamp(record: dict[str, Any], *keys: str) -> datetime | None:
    summary = record.get("summary", {}) or {}
    for key in keys:
        parsed = parse_api_datetime(summary.get(key))
        if parsed is not None:
            return parsed
    return None


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up central and per-shipment PaketHub sensors."""
    coordinator: PaketHubCoordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]

    async_add_entities(
        [
            PaketHubTotalPackagesSensor(coordinator, entry),
            PaketHubActivePackagesSensor(coordinator, entry),
            PaketHubInTransitPackagesSensor(coordinator, entry),
            PaketHubDeliveredPackagesSensor(coordinator, entry),
            PaketHubExceptionPackagesSensor(coordinator, entry),
            PaketHubOutForDeliveryTodaySensor(coordinator, entry),
            PaketHubDeliveredTodaySensor(coordinator, entry),
            PaketHubAverageTransitTimeSensor(coordinator, entry),
            PaketHubNewPackagesSensor(coordinator, entry),
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
                    PaketHubProgressSensor(coordinator, entry, number),
                    PaketHubLocationSensor(coordinator, entry, number),
                    PaketHubLatestEventSensor(coordinator, entry, number),
                    PaketHubTimelineSensor(coordinator, entry, number),
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
    """Base class for central numeric summary sensors."""

    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(
        self,
        coordinator: PaketHubCoordinator,
        entry: ConfigEntry,
        key: str,
        translation_key: str,
        icon: str,
    ) -> None:
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
        return sum(
            shipment_raw_status(record) not in INACTIVE_STATUSES
            for record in (self.coordinator.data or {}).values()
        )


class PaketHubInTransitPackagesSensor(PaketHubSummarySensor):
    def __init__(self, coordinator, entry):
        super().__init__(coordinator, entry, "in_transit_packages", "in_transit_packages", "mdi:truck-fast-outline")

    @property
    def native_value(self) -> int:
        return sum(
            shipment_raw_status(record) in IN_TRANSIT_STATUSES
            for record in (self.coordinator.data or {}).values()
        )


class PaketHubDeliveredPackagesSensor(PaketHubSummarySensor):
    def __init__(self, coordinator, entry):
        super().__init__(coordinator, entry, "delivered_packages", "delivered_packages", "mdi:package-variant-closed-check")

    @property
    def native_value(self) -> int:
        return sum(
            shipment_raw_status(record) == "Delivered"
            for record in (self.coordinator.data or {}).values()
        )


class PaketHubExceptionPackagesSensor(PaketHubSummarySensor):
    def __init__(self, coordinator, entry):
        super().__init__(coordinator, entry, "exception_packages", "exception_packages", "mdi:alert-circle-outline")

    @property
    def native_value(self) -> int:
        return sum(
            shipment_raw_status(record) in EXCEPTION_STATUSES
            for record in (self.coordinator.data or {}).values()
        )


class PaketHubOutForDeliveryTodaySensor(PaketHubSummarySensor):
    def __init__(self, coordinator, entry):
        super().__init__(coordinator, entry, "out_for_delivery_today", "out_for_delivery_today", "mdi:truck-delivery-outline")

    @property
    def native_value(self) -> int:
        today = dt_util.now().date()
        count = 0
        for record in (self.coordinator.data or {}).values():
            if shipment_raw_status(record) != "OutForDelivery":
                continue
            event_time = parse_api_datetime(shipment_latest_event(record).get("time_iso"))
            if event_time and dt_util.as_local(event_time).date() == today:
                count += 1
        return count


class PaketHubDeliveredTodaySensor(PaketHubSummarySensor):
    def __init__(self, coordinator, entry):
        super().__init__(coordinator, entry, "delivered_today", "delivered_today", "mdi:package-check-outline")

    @property
    def native_value(self) -> int:
        today = dt_util.now().date()
        count = 0
        for record in (self.coordinator.data or {}).values():
            if shipment_raw_status(record) != "Delivered":
                continue
            event_time = parse_api_datetime(shipment_latest_event(record).get("time_iso"))
            if event_time and dt_util.as_local(event_time).date() == today:
                count += 1
        return count


class PaketHubAverageTransitTimeSensor(PaketHubSummarySensor):
    _attr_native_unit_of_measurement = UnitOfTime.DAYS

    def __init__(self, coordinator, entry):
        super().__init__(coordinator, entry, "average_transit_time", "average_transit_time", "mdi:chart-timeline-variant")

    @property
    def native_value(self) -> float | None:
        values = [
            value
            for record in (self.coordinator.data or {}).values()
            if (value := _record_days_in_transit(record)) is not None
        ]
        return round(mean(values), 1) if values else None


class PaketHubNewPackagesSensor(PaketHubSummarySensor):
    def __init__(self, coordinator, entry):
        super().__init__(coordinator, entry, "new_packages_24h", "new_packages_24h", "mdi:package-variant-plus")

    @property
    def native_value(self) -> int:
        threshold = dt_util.utcnow() - timedelta(hours=24)
        count = 0
        for record in (self.coordinator.data or {}).values():
            registered = _record_timestamp(
                record,
                "register_time",
                "registerTime",
                "registered_at",
                "created_at",
            )
            if registered and registered >= threshold:
                count += 1
        return count


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
    """Base class for per-shipment sensors."""

    def __init__(self, coordinator, entry, tracking_number, sensor_key, translation_key):
        super().__init__(coordinator, entry, tracking_number)
        self._attr_translation_key = translation_key
        self._attr_unique_id = (
            f"{entry.entry_id}_{tracking_number}"
            if sensor_key == "status"
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
        return {
            "tracking_number": self._tracking_number,
            "package_name": self.package_name,
            "raw_status": self.raw_status,
            "tracking_url": self.tracking_url,
            "history": self.history,
        }


class PaketHubProgressSensor(PaketHubShipmentSensor):
    _attr_icon = "mdi:progress-clock"
    _attr_native_unit_of_measurement = PERCENTAGE
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, coordinator, entry, tracking_number):
        super().__init__(coordinator, entry, tracking_number, "progress", "progress")

    @property
    def native_value(self) -> int:
        return STATUS_PROGRESS.get(self.raw_status, 0)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {
            "calculation": "status_based",
            "raw_status": self.raw_status,
            "tracking_url": self.tracking_url,
        }


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
        return (
            translated.get("description")
            or self.latest_event_data.get("description")
            or self.summary.get("latest_event_info")
        )


class PaketHubTimelineSensor(PaketHubShipmentSensor):
    _attr_icon = "mdi:timeline-clock-outline"
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, coordinator, entry, tracking_number):
        super().__init__(coordinator, entry, tracking_number, "timeline_events", "timeline_events")

    @property
    def native_value(self) -> int:
        return len(self.history)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {
            "events": self.history,
            "latest": self.history[0] if self.history else None,
            "oldest": self.history[-1] if self.history else None,
        }


class PaketHubLastUpdateSensor(PaketHubShipmentSensor):
    _attr_icon = "mdi:clock-outline"
    _attr_device_class = SensorDeviceClass.TIMESTAMP

    def __init__(self, coordinator, entry, tracking_number):
        super().__init__(coordinator, entry, tracking_number, "last_update", "last_update")

    @property
    def native_value(self) -> datetime | None:
        return parse_api_datetime(
            self.latest_event_data.get("time_iso")
            or self.summary.get("latest_event_time")
        )


class PaketHubEtaSensor(PaketHubShipmentSensor):
    _attr_icon = "mdi:calendar-clock"
    _attr_device_class = SensorDeviceClass.DATE

    def __init__(self, coordinator, entry, tracking_number):
        super().__init__(coordinator, entry, tracking_number, "eta", "eta")

    @property
    def delivery_window(self) -> dict[str, Any]:
        return (
            self.track_info.get("time_metrics", {})
            .get("estimated_delivery_date", {})
            or {}
        )

    @property
    def native_value(self) -> date | None:
        return _parse_date(
            self.delivery_window.get("from") or self.delivery_window.get("to")
        )

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        eta_from = _parse_date(self.delivery_window.get("from"))
        eta_to = _parse_date(self.delivery_window.get("to"))
        today = dt_util.now().date()
        reference = eta_from or eta_to
        days_remaining = (reference - today).days if reference else None
        overdue = bool(eta_to and today > eta_to and self.raw_status != "Delivered")
        return {
            "estimated_delivery_from": self.delivery_window.get("from"),
            "estimated_delivery_to": self.delivery_window.get("to"),
            "days_remaining": days_remaining,
            "overdue": overdue,
            "is_today": bool(reference and reference == today),
            "is_tomorrow": bool(reference and reference == today + timedelta(days=1)),
        }


class PaketHubDaysInTransitSensor(PaketHubShipmentSensor):
    _attr_icon = "mdi:timer-sand"
    _attr_native_unit_of_measurement = UnitOfTime.DAYS
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, coordinator, entry, tracking_number):
        super().__init__(coordinator, entry, tracking_number, "days_in_transit", "days_in_transit")

    @property
    def native_value(self) -> int | None:
        return _record_days_in_transit(self.record)


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
            "tracking_url": self.tracking_url,
        }
