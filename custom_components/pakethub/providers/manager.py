"""Provider registry for PaketHub."""
from __future__ import annotations

from collections.abc import Iterable

from .autodetect import detect_provider_id
from .base import BaseProvider


class ProviderManager:
    """Store and resolve configured PaketHub providers."""

    def __init__(
        self,
        providers: Iterable[BaseProvider] = (),
        *,
        default_provider_id: str = "17track",
    ) -> None:
        self._providers = {provider.provider_id: provider for provider in providers}
        self._default_provider_id = default_provider_id

    def add(self, provider: BaseProvider) -> None:
        self._providers[provider.provider_id] = provider

    def get(self, provider_id: str) -> BaseProvider:
        return self._providers[provider_id]

    def get_optional(self, provider_id: str) -> BaseProvider | None:
        return self._providers.get(provider_id)

    @property
    def default_provider(self) -> BaseProvider:
        return self.get(self._default_provider_id)

    @property
    def default_provider_id(self) -> str:
        return self._default_provider_id

    def resolve_tracking_provider(self, tracking_number: str) -> BaseProvider | None:
        provider_id = detect_provider_id(tracking_number)
        return self._providers.get(provider_id) if provider_id else None

    @property
    def providers(self) -> tuple[BaseProvider, ...]:
        return tuple(self._providers.values())

    @property
    def provider_ids(self) -> tuple[str, ...]:
        return tuple(self._providers)

    @property
    def provider_names(self) -> tuple[str, ...]:
        return tuple(provider.provider_name for provider in self.providers)

    @property
    def native_provider_ids(self) -> tuple[str, ...]:
        return tuple(
            provider_id
            for provider_id in self._providers
            if provider_id != self._default_provider_id
        )

    def diagnostics(self) -> dict[str, object]:
        return {
            "registry_provider": self._default_provider_id,
            "configured_providers": list(self.provider_ids),
            "native_tracking_providers": list(self.native_provider_ids),
        }
