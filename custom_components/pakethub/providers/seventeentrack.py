"""17TRACK provider for PaketHub."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from aiohttp import ClientError, ClientResponseError, ClientSession

from .base import (
    BaseProvider,
    PaketHubProviderAuthenticationError,
    PaketHubProviderError,
)

API_BASE_URL = "https://api.17track.net/track/v2.4"


class SeventeenTrackProviderError(PaketHubProviderError):
    """Base error raised by the 17TRACK provider."""


class SeventeenTrackAuthenticationError(
    PaketHubProviderAuthenticationError,
    SeventeenTrackProviderError,
):
    """Authentication with 17TRACK failed."""


@dataclass(slots=True)
class SeventeenTrackProvider(BaseProvider):
    """Async provider implementation for the 17TRACK API v2.4."""

    session: ClientSession
    api_key: str

    provider_id = "17track"
    provider_name = "17TRACK"

    async def _post(self, endpoint: str, payload: Any) -> dict[str, Any]:
        """Send a POST request to the 17TRACK API."""
        headers = {
            "17token": self.api_key,
            "Content-Type": "application/json",
        }

        try:
            async with self.session.post(
                f"{API_BASE_URL}/{endpoint}",
                headers=headers,
                json=payload,
                timeout=30,
            ) as response:
                if response.status in (401, 403):
                    raise SeventeenTrackAuthenticationError("Invalid API key")
                response.raise_for_status()
                data = await response.json(content_type=None)
        except SeventeenTrackAuthenticationError:
            raise
        except (ClientResponseError, ClientError, TimeoutError, ValueError) as err:
            raise SeventeenTrackProviderError(str(err)) from err

        if not isinstance(data, dict):
            raise SeventeenTrackProviderError("Unexpected API response")

        if data.get("code", 0) != 0:
            message = data.get("message") or data.get("data") or data
            raise SeventeenTrackProviderError(f"17TRACK error: {message}")

        return data

    async def async_validate(self) -> None:
        """Validate the API key."""
        await self._post("getquota", [])

    async def async_get_track_list(self, page_no: int = 1) -> dict[str, Any]:
        """Return one page of registered shipments."""
        return await self._post(
            "gettracklist",
            {"page_no": page_no, "order_by": "RegisterTimeDesc"},
        )

    async def async_get_track_info(
        self,
        shipments: list[dict[str, Any]],
    ) -> dict[str, Any]:
        """Return detailed tracking information for up to 40 shipments."""
        payload = [
            {
                "number": shipment["number"],
                "carrier": int(shipment.get("carrier") or 0),
            }
            for shipment in shipments
            if shipment.get("number")
        ]

        if not payload:
            return {"code": 0, "data": {"accepted": [], "rejected": []}}

        return await self._post("gettrackinfo", payload)

    async def async_register(self, number: str, tag: str) -> dict[str, Any]:
        """Register a shipment."""
        return await self._post(
            "register",
            [
                {
                    "number": number.strip(),
                    "tag": tag.strip()[:100],
                    "lang": "de",
                    "translation_mode": "UseDefaultLang",
                }
            ],
        )

    async def async_change_tag(
        self,
        number: str,
        tag: str,
        carrier: int | None = None,
    ) -> dict[str, Any]:
        """Change the display name/tag of a registered shipment."""
        item: dict[str, Any] = {"number": number.strip(), "tag": tag.strip()[:100]}
        if carrier is not None:
            item["carrier"] = int(carrier)
        return await self._post("changetag", [item])

    async def async_delete(
        self,
        number: str,
        carrier: int | None = None,
    ) -> dict[str, Any]:
        """Permanently delete a registered shipment."""
        item: dict[str, Any] = {"number": number.strip()}
        if carrier is not None:
            item["carrier"] = int(carrier)

        return await self._post("deletetrack", [item])
