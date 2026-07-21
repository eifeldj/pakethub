---
hide:
  - navigation
  - toc
description: PaketHub ist eine moderne Paketverfolgungs-Integration für Home Assistant.
---

<div class="hero" markdown>

# PaketHub

Paketverfolgung, die sich in Home Assistant zuhause fühlt.

PaketHub verbindet die offizielle 17TRACK-API, native Carrier-Provider, automatischen Fallback, Diagnose und eine eigens entwickelte Dashboard-Karte.

[Schnellstart](quickstart.md){ .md-button .md-button--primary }
[Installation](installation.md){ .md-button }
[Auf GitHub öffnen](https://github.com/eifeldj/pakethub){ .md-button }

</div>

<div class="metric-strip" markdown>
<div><strong>2</strong>Tracking-Provider</div>
<div><strong>2</strong>Sprachen</div>
<div><strong>1</strong>zentrales Dashboard</div>
</div>

## Für hilfreiche Paketverfolgung gebaut

<div class="grid cards" markdown>

-   :material-package-variant-closed:{ .lg .middle } **Alle Sendungen an einem Ort**

    Status, ETA, Standort, Fortschritt und Verlauf stehen direkt in Home Assistant bereit.

    [Funktionen entdecken](features.md)

-   :material-truck-fast:{ .lg .middle } **Intelligente Provider-Auswahl**

    PaketHub erkennt den Carrier, nutzt zuerst den nativen Provider und wechselt bei Bedarf automatisch zum Fallback.

    [Provider-Architektur](providers.md)

-   :material-view-dashboard-variant:{ .lg .middle } **Eigene Dashboard-Karte**

    Responsive Darstellung mit Paketübersicht, Carrier-Branding und chronologischen Details.

    [Dashboard-Karte konfigurieren](dashboard-card.md)

-   :material-chart-timeline-variant-shimmer:{ .lg .middle } **Transparente Diagnose**

    Provider-Nutzung, Fallbacks, API-Laufzeiten, Update-Dauer und Versionsabgleich.

    [Diagnose-Anleitung](diagnostics.md)

</div>

## So arbeitet PaketHub

```mermaid
flowchart LR
    A[Home Assistant] --> B[PaketHub-Koordinator]
    B --> C[Provider-Erkennung]
    C --> D[Natives UPS]
    C --> E[17TRACK-Fallback]
    E --> F[Sendungsregister]
    D --> G[Normalisierte Trackingdaten]
    E --> G
    G --> H[Entitäten und Dashboard-Karte]
```

## Unterstützte Provider

<span class="provider-badge">:material-radar: 17TRACK · Register & Fallback</span>
<span class="provider-badge">:material-truck: UPS · natives Tracking</span>

!!! tip "Auf Wachstum ausgelegt"
    Das Provider-Framework ist bewusst erweiterbar, damit weitere Carrier integriert werden können, ohne die Bedienung zu verändern.
