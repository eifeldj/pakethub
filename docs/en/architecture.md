# Architecture

PaketHub keeps carrier-specific implementations separate from Home Assistant entities and the dashboard.

![PaketHub architecture](assets/architecture.svg)

## Processing flow

1. 17TRACK remains the shipment registry.
2. PaketHub detects the most suitable provider.
3. A native provider is preferred when available.
4. Unavailable or unusable native results trigger the 17TRACK fallback.
5. Provider-specific responses are normalized.
6. Home Assistant entities and the dashboard consume the normalized model.

## Design goals

- predictable fallback behavior,
- no provider-specific logic in the user interface,
- observable runtime and provider statistics,
- simple addition of future providers,
- safe handling of credentials and personal shipment data.
