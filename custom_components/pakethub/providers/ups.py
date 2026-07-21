"""Async UPS OAuth and Tracking API client for PaketHub."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import uuid4

from aiohttp import BasicAuth, ClientError, ClientResponseError, ClientSession

from .autodetect import normalize_tracking_number
from .base import (
    BaseProvider,
    PaketHubProviderAuthenticationError,
    PaketHubProviderError,
)

UPS_OAUTH_URL = "https://onlinetools.ups.com/security/v1/oauth/token"
UPS_TRACKING_URL = "https://onlinetools.ups.com/api/track/v1/details"


class UpsProviderError(PaketHubProviderError):
    """Base UPS provider error."""


class UpsAuthenticationError(PaketHubProviderAuthenticationError, UpsProviderError):
    """UPS authentication failed."""


class UpsTrackingNotFoundError(UpsProviderError):
    """UPS has no tracking information for the supplied number."""


@dataclass(slots=True)
class UpsProvider(BaseProvider):
    """Small async wrapper around UPS OAuth and Tracking APIs."""

    session: ClientSession
    client_id: str
    client_secret: str
    locale: str = "de_AT"
    provider_id: str = field(init=False, default="ups")
    provider_name: str = field(init=False, default="UPS")
    _access_token: str | None = field(init=False, default=None)
    _token_expires_at: datetime | None = field(init=False, default=None)

    async def _async_get_access_token(self, *, force: bool = False) -> str:
        """Return a cached OAuth token or request a fresh one."""
        now = datetime.now(UTC)
        if (
            not force
            and self._access_token
            and self._token_expires_at
            and now < self._token_expires_at
        ):
            return self._access_token

        try:
            async with self.session.post(
                UPS_OAUTH_URL,
                auth=BasicAuth(self.client_id, self.client_secret),
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data={"grant_type": "client_credentials"},
                timeout=30,
            ) as response:
                if response.status in (400, 401, 403):
                    raise UpsAuthenticationError("Invalid UPS client credentials")
                response.raise_for_status()
                payload = await response.json(content_type=None)
        except UpsAuthenticationError:
            raise
        except (ClientResponseError, ClientError, TimeoutError, ValueError) as err:
            raise UpsProviderError(str(err)) from err

        token = payload.get("access_token") if isinstance(payload, dict) else None
        if not token:
            raise UpsAuthenticationError("UPS OAuth response contained no access token")

        try:
            expires_in = max(60, int(payload.get("expires_in", 3600)))
        except (TypeError, ValueError):
            expires_in = 3600

        self._access_token = str(token)
        self._token_expires_at = now + timedelta(seconds=max(30, expires_in - 60))
        return self._access_token

    async def async_validate(self) -> None:
        """Validate the configured UPS OAuth credentials."""
        await self._async_get_access_token(force=True)

    async def async_track(self, number: str) -> dict[str, Any]:
        """Return normalized PaketHub tracking details for one UPS shipment."""
        tracking_number = normalize_tracking_number(number)
        token = await self._async_get_access_token()
        payload = await self._async_tracking_request(tracking_number, token)
        return self._normalize_tracking_response(tracking_number, payload)

    async def _async_tracking_request(
        self, tracking_number: str, token: str
    ) -> dict[str, Any]:
        """Request tracking information, retrying once after an expired token."""
        for attempt in range(2):
            try:
                async with self.session.get(
                    f"{UPS_TRACKING_URL}/{tracking_number}",
                    params={"locale": self.locale, "returnSignature": "false"},
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Content-Type": "application/json",
                        "transId": uuid4().hex[:32],
                        "transactionSrc": "PaketHub",
                    },
                    timeout=30,
                ) as response:
                    data = await response.json(content_type=None)
                    if response.status == 401 and attempt == 0:
                        token = await self._async_get_access_token(force=True)
                        continue
                    if response.status in (401, 403):
                        raise UpsAuthenticationError("UPS rejected the access token")
                    if response.status == 404:
                        raise UpsTrackingNotFoundError(
                            f"No UPS tracking information for {tracking_number}"
                        )
                    response.raise_for_status()
            except (UpsAuthenticationError, UpsTrackingNotFoundError):
                raise
            except (ClientResponseError, ClientError, TimeoutError, ValueError) as err:
                raise UpsProviderError(str(err)) from err

            if not isinstance(data, dict):
                raise UpsProviderError("Unexpected UPS tracking response")

            errors = data.get("response", {}).get("errors", [])
            if errors:
                first = errors[0] if isinstance(errors, list) else errors
                code = first.get("code") if isinstance(first, dict) else None
                message = first.get("message") if isinstance(first, dict) else first
                if code == "TW0001":
                    raise UpsTrackingNotFoundError(str(message or code))
                raise UpsProviderError(f"UPS tracking error {code or ''}: {message}")

            return data

        raise UpsAuthenticationError("UPS authentication retry failed")

    @staticmethod
    def _normalize_tracking_response(
        tracking_number: str, payload: dict[str, Any]
    ) -> dict[str, Any]:
        """Map a UPS tracking response to PaketHub's current detail structure."""
        shipments = payload.get("trackResponse", {}).get("shipment", [])
        if isinstance(shipments, dict):
            shipments = [shipments]
        shipment = shipments[0] if shipments else {}

        packages = shipment.get("package", []) if isinstance(shipment, dict) else []
        if isinstance(packages, dict):
            packages = [packages]
        package = packages[0] if packages else {}

        activities = package.get("activity", []) if isinstance(package, dict) else []
        if isinstance(activities, dict):
            activities = [activities]

        events = [UpsProvider._normalize_activity(item) for item in activities]
        events = [item for item in events if item]
        events.sort(key=lambda item: item.get("time_iso") or "", reverse=True)
        latest_event = events[0] if events else {}

        current_status = package.get("currentStatus", {}) if isinstance(package, dict) else {}
        status_code = current_status.get("code") or latest_event.get("status") or "Unknown"
        status_description = current_status.get("description") or latest_event.get(
            "description"
        )

        delivery_date = None
        delivery_dates = package.get("deliveryDate", []) if isinstance(package, dict) else []
        if isinstance(delivery_dates, dict):
            delivery_dates = [delivery_dates]
        if delivery_dates:
            delivery_date = delivery_dates[0].get("date")

        return {
            "number": tracking_number,
            "carrier_name": "UPS",
            "provider_id": "ups",
            "track_info": {
                "latest_status": {
                    "status": UpsProvider._map_status(status_code, status_description),
                    "sub_status": status_code,
                },
                "latest_event": latest_event,
                "time_metrics": {"estimated_delivery_date": delivery_date},
                "tracking": {
                    "providers": [
                        {
                            "provider": {"name": "UPS", "key": "ups"},
                            "events": events,
                        }
                    ]
                },
            },
            "raw": payload,
        }

    @staticmethod
    def _normalize_activity(activity: Any) -> dict[str, Any]:
        if not isinstance(activity, dict):
            return {}
        status = activity.get("status", {}) or {}
        location = activity.get("location", {}) or {}
        address = location.get("address", {}) or {}
        date = str(activity.get("date") or "")
        time = str(activity.get("time") or "")
        time_iso = None
        if len(date) == 8:
            value = f"{date}{time[:6].ljust(6, '0')}"
            try:
                time_iso = datetime.strptime(value, "%Y%m%d%H%M%S").replace(
                    tzinfo=UTC
                ).isoformat()
            except ValueError:
                time_iso = None
        return {
            "time_iso": time_iso,
            "description": status.get("description"),
            "location": location.get("slic") or None,
            "address": {
                "city": address.get("city"),
                "state": address.get("stateProvince"),
                "country": address.get("countryCode"),
            },
            "sub_status": status.get("code") or status.get("type"),
            "status": status.get("type") or status.get("code"),
        }

    @staticmethod
    def _map_status(code: Any, description: Any) -> str:
        value = f"{code or ''} {description or ''}".lower()
        if any(word in value for word in ("delivered", "zugestellt")):
            return "Delivered"
        if any(word in value for word in ("out for delivery", "zustellung")):
            return "OutForDelivery"
        if any(word in value for word in ("exception", "problem", "delay", "verzöger")):
            return "Exception"
        if any(word in value for word in ("pickup", "label", "manifest")):
            return "InfoReceived"
        return "InTransit"

    async def async_get_track_list(self, page_no: int = 1) -> dict[str, Any]:
        """UPS has no API for listing all incoming shipments."""
        raise UpsProviderError("UPS does not provide a shipment-list endpoint")

    async def async_get_track_info(
        self, shipments: list[dict[str, Any]]
    ) -> dict[str, Any]:
        """Return 17TRACK-compatible accepted/rejected result containers."""
        accepted: list[dict[str, Any]] = []
        rejected: list[dict[str, Any]] = []
        for shipment in shipments:
            number = shipment.get("number")
            if not number:
                continue
            try:
                accepted.append(await self.async_track(str(number)))
            except UpsProviderError as err:
                rejected.append({"number": number, "error": {"message": str(err)}})
        return {"code": 0, "data": {"accepted": accepted, "rejected": rejected}}

    async def async_register(self, number: str, tag: str) -> dict[str, Any]:
        """Direct UPS tracking does not maintain a shipment registry."""
        raise UpsProviderError("UPS does not support registering shipments")

    async def async_change_tag(
        self, number: str, tag: str, carrier: int | None = None
    ) -> dict[str, Any]:
        """Direct UPS tracking does not store PaketHub labels."""
        raise UpsProviderError("UPS does not support shipment labels")

    async def async_delete(
        self, number: str, carrier: int | None = None
    ) -> dict[str, Any]:
        """Direct UPS tracking does not maintain a shipment registry."""
        raise UpsProviderError("UPS does not support deleting shipments")
