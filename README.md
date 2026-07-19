# PaketHub

PaketHub is a custom Home Assistant integration for parcel tracking through the official 17TRACK API v2.4.

> **Project status:** Early development release. One 17TRACK account per Home Assistant instance is currently supported.

## Features

- UI configuration and configurable polling interval
- One Home Assistant device per shipment
- Status, location, latest event, last update, ETA, transit days and carrier sensors
- Full tracking history in the status sensor attributes
- Central PaketHub device with package counters, last synchronization, API connectivity and refresh button
- Dynamic icons for shipment states
- Home Assistant actions for adding, removing and refreshing shipments
- Privacy-conscious diagnostics
- German and English translations

## Installation with HACS

1. Open **HACS** in Home Assistant.
2. Open the three-dot menu and select **Custom repositories**.
3. Add `https://github.com/eifeldj/pakethub` as an **Integration**.
4. Search for **PaketHub** and install it.
5. Restart Home Assistant.
6. Open **Settings → Devices & services → Add integration** and select **PaketHub**.
7. Enter your official 17TRACK API v2.4 key.

## Manual installation

Copy `custom_components/pakethub` to `/config/custom_components/pakethub`, restart Home Assistant and add PaketHub through the integrations UI.

## Actions

```yaml
action: pakethub.add_package
data:
  tracking_number: YT2637821437895478
  package_name: Bambu Lab
```

```yaml
action: pakethub.remove_package
data:
  tracking_number: YT2637821437895478
```

```yaml
action: pakethub.refresh
```

## Updating from TrackHub

Remove the old `trackhub` integration and `/config/custom_components/trackhub` directory before installing PaketHub. Shipments remain registered in the 17TRACK account and are imported again.

## Support and privacy

Report bugs through the GitHub issue tracker. Never include API keys, tracking numbers, addresses or private shipment details in public issues.

## License

MIT License.

## Native Dashboard-Karte

Seit Version 0.7.0 enthält PaketHub eine eigene Lovelace-Karte. Sie erkennt alle PaketHub-Sendungen automatisch und kann direkt im visuellen Karteneditor hinzugefügt werden.

```yaml
type: custom:pakethub-card
title: Meine Pakete
show_delivered: false
max_packages: 8
sort_by: status
tap_action: url
```

Die JavaScript-Ressource wird bei Dashboards im Storage-Modus automatisch registriert. Hinweise für YAML-Dashboards stehen unter `dashboard/README.md`.
