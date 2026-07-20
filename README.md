# PaketHub

![PaketHub – Parcel Tracking for Home Assistant](images/hacs-banner.png)

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://www.hacs.xyz/)
[![GitHub Release](https://img.shields.io/github/v/release/eifeldj/pakethub)](https://github.com/eifeldj/pakethub/releases)
[![License](https://img.shields.io/github/license/eifeldj/pakethub)](LICENSE)

PaketHub is a custom Home Assistant integration for parcel tracking through the official 17TRACK API v2.4.

**Version 1.0.0** introduces a complete native Lovelace experience with package cards, a package detail dialog, chronological tracking timelines, copyable tracking numbers, and direct links to 17TRACK.

> German documentation: [README.de.md](README.de.md)

## Features

- Configuration through the Home Assistant UI
- Configurable polling interval
- Automatic import of shipments from one 17TRACK account
- One Home Assistant device per shipment
- Status, location, latest event, last update, ETA, transit days, and carrier sensors
- Full tracking history in the status sensor attributes
- Native Lovelace card with automatic shipment detection
- Package detail dialog with a chronological tracking timeline
- Copyable tracking number and direct 17TRACK link
- Central PaketHub device with package counters and API connectivity status
- Refresh button and Home Assistant actions for adding, removing, and refreshing shipments
- Dynamic shipment-state icons
- Privacy-conscious diagnostics
- German and English integration translations

## Requirements

- Home Assistant with HACS or manual custom integration support
- A valid official 17TRACK API v2.4 key
- One 17TRACK account per Home Assistant instance

## Installation with HACS

1. Open **HACS** in Home Assistant.
2. Open the three-dot menu and choose **Custom repositories**.
3. Add `https://github.com/eifeldj/pakethub` as an **Integration**.
4. Search for **PaketHub** and install it.
5. Restart Home Assistant.
6. Open **Settings → Devices & services → Add integration**.
7. Select **PaketHub** and enter your 17TRACK API key.

## Manual installation

Copy `custom_components/pakethub` to `/config/custom_components/pakethub`, restart Home Assistant, and add PaketHub through the integrations UI.

## Native dashboard card

PaketHub automatically registers its JavaScript resource for dashboards in storage mode. The card can be added through the visual dashboard editor.

```yaml
type: custom:pakethub-card
title: My Packages
show_delivered: false
max_packages: 8
sort_by: status
tap_action: details
```

### Card options

| Option | Default | Description |
|---|---:|---|
| `title` | `PaketHub` | Card title |
| `show_delivered` | `false` | Include delivered shipments |
| `max_packages` | `8` | Maximum number of visible shipments |
| `sort_by` | `status` | Sort by `status`, `eta`, or `name` |
| `tap_action` | `details` | Use `details`, `url`, or `more-info` |

`details` opens the PaketHub timeline, `url` opens 17TRACK, and `more-info` opens the Home Assistant entity dialog.

For YAML-mode dashboards, see [dashboard/README.md](dashboard/README.md).

## Actions

### Add a shipment

```yaml
action: pakethub.add_package
data:
  tracking_number: YT2637821437895478
  package_name: Bambu Lab
```

### Remove a shipment

```yaml
action: pakethub.remove_package
data:
  tracking_number: YT2637821437895478
```

### Refresh all shipments

```yaml
action: pakethub.refresh
```

## Updating from TrackHub

Remove the old `trackhub` integration and `/config/custom_components/trackhub` directory before installing PaketHub. Shipments remain registered in the 17TRACK account and are imported again.

## Support and privacy

Report bugs through the GitHub issue tracker. Never include API keys, full tracking numbers, addresses, or private shipment details in public issues.

## License

PaketHub is released under the [MIT License](LICENSE).
