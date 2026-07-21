# PaketHub 2.4.0-alpha.2

This incremental update is applied after alpha.1.

- Adds UPS OAuth 2.0 client-credentials authentication.
- Caches access tokens and refreshes them before expiry.
- Adds direct UPS Tracking API requests.
- Normalizes UPS tracking events into PaketHub's existing detail format.
- Detects standard UPS `1Z` tracking numbers.
- Extends `ProviderManager` with direct-provider resolution.

The UPS provider is intentionally not wired into the Home Assistant config flow or coordinator yet. Alpha.2 establishes and syntax-checks the isolated API layer first; the next update connects credentials and live coordinator enrichment.
