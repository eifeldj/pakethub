# Providers

PaketHub separates shipment registration from native tracking.

| Provider | Role | Status |
| --- | --- | --- |
| 17TRACK | Shipment registry and fallback tracking | Supported |
| UPS | Native tracking | Supported |

## Selection and fallback

The ProviderManager selects a suitable native provider. When it cannot return usable tracking data, PaketHub automatically falls back to 17TRACK.
