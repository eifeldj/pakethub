"""Tracking providers supported by PaketHub."""

from .autodetect import detect_provider_id, normalize_tracking_number
from .base import (
    BaseProvider,
    PaketHubProviderAuthenticationError,
    PaketHubProviderError,
)
from .manager import ProviderManager
from .seventeentrack import (
    SeventeenTrackAuthenticationError,
    SeventeenTrackProvider,
    SeventeenTrackProviderError,
)
from .ups import (
    UpsAuthenticationError,
    UpsProvider,
    UpsProviderError,
    UpsTrackingNotFoundError,
)

__all__ = [
    "BaseProvider",
    "PaketHubProviderAuthenticationError",
    "PaketHubProviderError",
    "ProviderManager",
    "SeventeenTrackAuthenticationError",
    "SeventeenTrackProvider",
    "SeventeenTrackProviderError",
    "UpsAuthenticationError",
    "UpsProvider",
    "UpsProviderError",
    "UpsTrackingNotFoundError",
    "detect_provider_id",
    "normalize_tracking_number",
]
