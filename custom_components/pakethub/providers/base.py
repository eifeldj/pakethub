"""Base classes shared by PaketHub tracking providers."""
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class PaketHubProviderError(Exception):
    """Base error raised by a PaketHub provider."""


class PaketHubProviderAuthenticationError(PaketHubProviderError):
    """Authentication with a PaketHub provider failed."""


class BaseProvider(ABC):
    """Common interface implemented by all PaketHub providers."""

    provider_id: str
    provider_name: str

    @abstractmethod
    async def async_validate(self) -> None:
        """Validate the provider configuration."""

    @abstractmethod
    async def async_get_track_list(self, page_no: int = 1) -> dict[str, Any]:
        """Return one page of registered shipments."""

    @abstractmethod
    async def async_get_track_info(
        self,
        shipments: list[dict[str, Any]],
    ) -> dict[str, Any]:
        """Return detailed tracking information for shipments."""

    @abstractmethod
    async def async_register(self, number: str, tag: str) -> dict[str, Any]:
        """Register a shipment with the provider."""

    @abstractmethod
    async def async_change_tag(
        self,
        number: str,
        tag: str,
        carrier: int | None = None,
    ) -> dict[str, Any]:
        """Change the display name of a registered shipment."""

    @abstractmethod
    async def async_delete(
        self,
        number: str,
        carrier: int | None = None,
    ) -> dict[str, Any]:
        """Delete a registered shipment."""
