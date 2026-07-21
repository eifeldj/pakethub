---
hide:
  - navigation
  - toc
description: PaketHub is a modern parcel-tracking integration for Home Assistant.
---

<div class="hero" markdown>

# PaketHub

Parcel tracking that feels native to Home Assistant.

PaketHub combines the official 17TRACK API, native carrier providers, automatic fallback, diagnostics and a purpose-built dashboard card.

[Get started](quickstart.md){ .md-button .md-button--primary }
[Installation](installation.md){ .md-button }
[View on GitHub](https://github.com/eifeldj/pakethub){ .md-button }

</div>

<div class="metric-strip" markdown>
<div><strong>2</strong>tracking providers</div>
<div><strong>2</strong>languages</div>
<div><strong>1</strong>unified dashboard</div>
</div>

## Built for useful tracking

<div class="grid cards" markdown>

-   :material-package-variant-closed:{ .lg .middle } **One place for every shipment**

    Status, ETA, location, progress and tracking history are available in Home Assistant.

    [Explore features](features.md)

-   :material-truck-fast:{ .lg .middle } **Native provider intelligence**

    PaketHub detects the carrier, tries the native provider first and falls back automatically.

    [Provider architecture](providers.md)

-   :material-view-dashboard-variant:{ .lg .middle } **A dedicated dashboard card**

    A responsive card with package summaries, carrier branding and chronological details.

    [Configure the card](dashboard-card.md)

-   :material-chart-timeline-variant-shimmer:{ .lg .middle } **Transparent diagnostics**

    Provider usage, fallbacks, API runtimes, update duration and version synchronization.

    [Open diagnostics guide](diagnostics.md)

</div>

## How PaketHub works

```mermaid
flowchart LR
    A[Home Assistant] --> B[PaketHub coordinator]
    B --> C[Provider detection]
    C --> D[Native UPS]
    C --> E[17TRACK fallback]
    E --> F[Shipment registry]
    D --> G[Normalized tracking data]
    E --> G
    G --> H[Entities and dashboard card]
```

## Supported providers

<span class="provider-badge">:material-radar: 17TRACK · registry & fallback</span>
<span class="provider-badge">:material-truck: UPS · native tracking</span>

!!! tip "Designed to grow"
    The provider framework is intentionally extensible, so more carrier-specific integrations can be added without changing the user experience.
