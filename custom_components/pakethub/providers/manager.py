"""Provider registry for PaketHub."""
from __future__ import annotations

from collections.abc import Iterable

from .autodetect import detect_provider_id
from .base import BaseProvider


class ProviderManager:
    """Store and resolve configured PaketHub providers."""

    def __init__(self, providers: Iterable[BaseProvider] = ()) -> None:
        self._providers: dict[str, BaseProvider] = {
            provider.provider_id: provider for provider in providers
        }

    def add(self, provider: BaseProvider) -> None:
        """Register or replace a provider."""
        self._providers[provider.provider_id] = provider

    def get(self, provider_id: str) -> BaseProvider:
        """Return one configured provider."""
        return self._providers[provider_id]

    def get_optional(self, provider_id: str) -> BaseProvider | None:
        """Return a provider when configured."""
        return self._providers.get(provider_id)

    def resolve_tracking_provider(self, tracking_number: str) -> BaseProvider | None:
        """Resolve a configured direct provider for a tracking number."""
        provider_id = detect_provider_id(tracking_number)
        return self._providers.get(provider_id) if provider_id else None

    @property
    def providers(self) -> tuple[BaseProvider, ...]:
        """Return configured providers in registration order."""
        return tuple(self._providers.values())
