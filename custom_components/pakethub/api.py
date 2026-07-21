"""Backward-compatible 17TRACK API aliases for PaketHub.

The provider implementation now lives in ``providers.seventeentrack``.  These
aliases keep existing imports and runtime behavior unchanged during the
multi-provider migration.
"""

from .providers.seventeentrack import (
    SeventeenTrackAuthenticationError,
    SeventeenTrackProvider,
    SeventeenTrackProviderError,
)

PaketHubApi = SeventeenTrackProvider
PaketHubApiError = SeventeenTrackProviderError
PaketHubAuthenticationError = SeventeenTrackAuthenticationError

__all__ = [
    "PaketHubApi",
    "PaketHubApiError",
    "PaketHubAuthenticationError",
]
