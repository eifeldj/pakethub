"""Shared PaketHub entities and shipment helpers."""
from __future__ import annotations

from datetime import datetime
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.util import dt as dt_util

from .const import CENTRAL_DEVICE_IDENTIFIER, DOMAIN
from .coordinator import PaketHubCoordinator


class PaketHubEntity(CoordinatorEntity[PaketHubCoordinator]):
    """Base entity attached to the central PaketHub device."""

    _attr_has_entity_name = True

    def __init__(self, coordinator: PaketHubCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator)
        self._entry = entry

    @property
    def device_info(self) -> DeviceInfo:
        """Return information for the central PaketHub device."""
        return DeviceInfo(
            identifiers={(DOMAIN, CENTRAL_DEVICE_IDENTIFIER)},
            name="PaketHub",
            manufacturer="PaketHub",
            model="17TRACK Cloud Service",
            configuration_url="https://github.com/eifeldj/pakethub",
        )


class PaketHubShipmentEntity(CoordinatorEntity[PaketHubCoordinator]):
    """Base entity linked to one shipment device."""

    _attr_has_entity_name = True

    def __init__(
        self, coordinator: PaketHubCoordinator, entry: ConfigEntry, tracking_number: str
    ) -> None:
        super().__init__(coordinator)
        self._entry = entry
        self._tracking_number = tracking_number

    @property
    def available(self) -> bool:
        """Return whether this shipment is present in coordinator data."""
        return super().available and self._tracking_number in (self.coordinator.data or {})

    @property
    def device_info(self) -> DeviceInfo:
        """Return information for the shipment device."""
        return DeviceInfo(
            identifiers={(DOMAIN, self._tracking_number)},
            name=self.package_name,
            manufacturer="17TRACK",
            model=self.carrier_name or "Parcel tracking",
            configuration_url=f"https://t.17track.net/de#nums={self._tracking_number}",
            via_device=(DOMAIN, CENTRAL_DEVICE_IDENTIFIER),
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
    def raw_status(self) -> str:
        return shipment_raw_status(self.record)

    @property
    def package_name(self) -> str:
        return self.detail.get("tag") or self.summary.get("tag") or self._tracking_number

    @property
    def latest_event_data(self) -> dict[str, Any]:
        return self.track_info.get("latest_event", {}) or {}

    @staticmethod
    def event_location(event: dict[str, Any]) -> str | None:
        """Build a readable location from an event."""
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
        """Return a normalized, newest-first shipment timeline."""
        providers = self.track_info.get("tracking", {}).get("providers", [])
        result: list[dict[str, Any]] = []
        for provider_record in providers:
            provider = provider_record.get("provider") or {}
            provider_name = provider.get("name")
            for event in provider_record.get("events", []):
                if not isinstance(event, dict):
                    continue
                translated = event.get("description_translation") or {}
                result.append(
                    {
                        "time": event.get("time_iso"),
                        "description": translated.get("description")
                        or event.get("description"),
                        "location": self.event_location(event),
                        "provider": provider_name,
                        "status": event.get("sub_status"),
                    }
                )
        result.sort(key=lambda item: item.get("time") or "", reverse=True)
        return result

    @property
    def tracking_url(self) -> str:
        return f"https://t.17track.net/de#nums={self._tracking_number}"


def shipment_raw_status(record: dict[str, Any]) -> str:
    """Extract a normalized top-level status from a coordinator record."""
    summary = record.get("summary", {}) or {}
    detail = record.get("detail", {}) or {}
    track_info = detail.get("track_info", {}) or {}
    return (
        track_info.get("latest_status", {}).get("status")
        or summary.get("package_status")
        or "Unknown"
    )


def shipment_latest_event(record: dict[str, Any]) -> dict[str, Any]:
    """Return the latest event dictionary from a coordinator record."""
    detail = record.get("detail", {}) or {}
    track_info = detail.get("track_info", {}) or {}
    return track_info.get("latest_event", {}) or {}


def parse_api_datetime(value: Any) -> datetime | None:
    """Parse a timestamp returned by 17TRACK."""
    if not isinstance(value, str) or not value:
        return None
    parsed = dt_util.parse_datetime(value)
    if parsed is None:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=dt_util.UTC)
    return parsed
