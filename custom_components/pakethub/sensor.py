"""Sensor platform for PaketHub."""
from __future__ import annotations

from datetime import date, datetime
import logging
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfTime
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.util import dt as dt_util

from .const import DOMAIN
from .coordinator import PaketHubCoordinator

_LOGGER = logging.getLogger(__name__)

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


def _parse_datetime(value: Any) -> datetime | None:
    """Parse an API timestamp."""
    if not isinstance(value, str) or not value:
        return None
    parsed = dt_util.parse_datetime(value)
    if parsed is None:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=dt_util.UTC)
    return parsed


def _parse_date(value: Any) -> date | None:
    """Parse an API date."""
    if not isinstance(value, str) or not value:
        return None
    try:
        return date.fromisoformat(value[:10])
    except ValueError:
        return None


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Create every sensor for every shipment."""
    coordinator: PaketHubCoordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]
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

        _LOGGER.info(
            "Adding %s PaketHub entities for %s shipment(s)",
            len(entities),
            len(numbers),
        )
        async_add_entities(entities)
        added_numbers.update(numbers)

    add_missing_shipments()
    entry.async_on_unload(coordinator.async_add_listener(add_missing_shipments))


class PaketHubShipmentSensor(
    CoordinatorEntity[PaketHubCoordinator],
    SensorEntity,
):
    """Base sensor linked to one shipment device."""

    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: PaketHubCoordinator,
        entry: ConfigEntry,
        tracking_number: str,
        sensor_key: str,
        sensor_name: str,
    ) -> None:
        super().__init__(coordinator)
        self._tracking_number = tracking_number
        self._attr_name = sensor_name

        # The v0.1 entity becomes the status sensor without duplication.
        if sensor_key == "status":
            self._attr_unique_id = f"{entry.entry_id}_{tracking_number}"
        else:
            self._attr_unique_id = (
                f"{entry.entry_id}_{tracking_number}_{sensor_key}"
            )

    @property
    def available(self) -> bool:
        """Return whether shipment data is available."""
        return (
            super().available
            and self._tracking_number in (self.coordinator.data or {})
        )

    @property
    def device_info(self) -> DeviceInfo:
        """Group all shipment sensors below one parcel device."""
        return DeviceInfo(
            identifiers={(DOMAIN, self._tracking_number)},
            name=self.package_name,
            manufacturer="17TRACK",
            model=self.carrier_name or "Paketverfolgung",
            configuration_url=(
                f"https://t.17track.net/de#nums={self._tracking_number}"
            ),
        )

    @property
    def record(self) -> dict[str, Any]:
        return (self.coordinator.data or {}).get(self._tracking_number, {})

    @property
    def summary(self) -> dict[str, Any]:
        return self.record.get("summary", {}) or {}

    @property
    def detail(self) -> dict[str, Any]:
        return self.record.get("detail", {}) or {}

    @property
    def track_info(self) -> dict[str, Any]:
        return self.detail.get("track_info", {}) or {}

    @property
    def package_name(self) -> str:
        return (
            self.detail.get("tag")
            or self.summary.get("tag")
            or self._tracking_number
        )

    @property
    def latest_event_data(self) -> dict[str, Any]:
        return self.track_info.get("latest_event", {}) or {}

    @staticmethod
    def event_location(event: dict[str, Any]) -> str | None:
        """Build a readable event location."""
        explicit = event.get("location")
        if explicit:
            return str(explicit)

        address = event.get("address") or {}
        location = ", ".join(
            str(value)
            for value in (
                address.get("city"),
                address.get("state"),
                address.get("country"),
            )
            if value
        )
        return location or None

    @property
    def carrier_name(self) -> str | None:
        providers = self.track_info.get("tracking", {}).get("providers", [])
        if providers:
            provider = providers[0].get("provider") or {}
            return provider.get("name")
        return self.detail.get("carrier_name") or self.summary.get("carrier_name")

    @property
    def history(self) -> list[dict[str, Any]]:
        """Return the complete tracking timeline."""
        providers = self.track_info.get("tracking", {}).get("providers", [])
        result: list[dict[str, Any]] = []

        for provider_record in providers:
            provider = provider_record.get("provider") or {}
            provider_name = provider.get("name")

            for event in provider_record.get("events", []):
                translated = event.get("description_translation") or {}
                result.append(
                    {
                        "time": event.get("time_iso"),
                        "description": (
                            translated.get("description")
                            or event.get("description")
                        ),
                        "location": self.event_location(event),
                        "provider": provider_name,
                        "status": event.get("sub_status"),
                    }
                )

        result.sort(key=lambda item: item.get("time") or "", reverse=True)
        return result


class PaketHubStatusSensor(PaketHubShipmentSensor):
    """Current shipment status."""

    _attr_icon = "mdi:package-variant-closed"

    def __init__(self, coordinator, entry, tracking_number) -> None:
        super().__init__(
            coordinator, entry, tracking_number, "status", "Status"
        )

    @property
    def native_value(self) -> str:
        raw_status = (
            self.track_info.get("latest_status", {}).get("status")
            or self.summary.get("package_status")
            or "Unknown"
        )
        return STATUS_TRANSLATIONS.get(raw_status, raw_status)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {
            "tracking_number": self._tracking_number,
            "package_name": self.package_name,
            "history": self.history,
        }


class PaketHubLocationSensor(PaketHubShipmentSensor):
    """Current shipment location."""

    _attr_icon = "mdi:map-marker"

    def __init__(self, coordinator, entry, tracking_number) -> None:
        super().__init__(
            coordinator, entry, tracking_number, "location", "Standort"
        )

    @property
    def native_value(self) -> str | None:
        return self.event_location(self.latest_event_data)


class PaketHubLatestEventSensor(PaketHubShipmentSensor):
    """Latest shipment event."""

    _attr_icon = "mdi:message-text-clock-outline"

    def __init__(self, coordinator, entry, tracking_number) -> None:
        super().__init__(
            coordinator,
            entry,
            tracking_number,
            "latest_event",
            "Letztes Ereignis",
        )

    @property
    def native_value(self) -> str | None:
        translated = (
            self.latest_event_data.get("description_translation") or {}
        )
        return (
            translated.get("description")
            or self.latest_event_data.get("description")
            or self.summary.get("latest_event_info")
        )


class PaketHubLastUpdateSensor(PaketHubShipmentSensor):
    """Time of the latest shipment event."""

    _attr_icon = "mdi:clock-outline"
    _attr_device_class = SensorDeviceClass.TIMESTAMP

    def __init__(self, coordinator, entry, tracking_number) -> None:
        super().__init__(
            coordinator,
            entry,
            tracking_number,
            "last_update",
            "Letztes Update",
        )

    @property
    def native_value(self) -> datetime | None:
        return _parse_datetime(
            self.latest_event_data.get("time_iso")
            or self.summary.get("latest_event_time")
        )


class PaketHubEtaSensor(PaketHubShipmentSensor):
    """Estimated delivery date."""

    _attr_icon = "mdi:calendar-clock"
    _attr_device_class = SensorDeviceClass.DATE

    def __init__(self, coordinator, entry, tracking_number) -> None:
        super().__init__(
            coordinator,
            entry,
            tracking_number,
            "eta",
            "Voraussichtliche Zustellung",
        )

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
            self.delivery_window.get("from")
            or self.delivery_window.get("to")
        )

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {
            "estimated_delivery_from": self.delivery_window.get("from"),
            "estimated_delivery_to": self.delivery_window.get("to"),
        }


class PaketHubDaysInTransitSensor(PaketHubShipmentSensor):
    """Number of days in transit."""

    _attr_icon = "mdi:timer-sand"
    _attr_native_unit_of_measurement = UnitOfTime.DAYS
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, coordinator, entry, tracking_number) -> None:
        super().__init__(
            coordinator,
            entry,
            tracking_number,
            "days_in_transit",
            "Tage unterwegs",
        )

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
    """Shipment carrier."""

    _attr_icon = "mdi:truck-delivery-outline"
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, coordinator, entry, tracking_number) -> None:
        super().__init__(
            coordinator,
            entry,
            tracking_number,
            "carrier",
            "Paketdienst",
        )

    @property
    def native_value(self) -> str | None:
        return self.carrier_name

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {
            "carrier_code": (
                self.detail.get("carrier") or self.summary.get("carrier")
            ),
            "shipping_country": self.summary.get("shipping_country"),
            "recipient_country": self.summary.get("recipient_country"),
        }
