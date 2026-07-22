
<div align="center">
<img src=".github/assets/repository-banner.svg" alt="PaketHub" width="100%">

[![Release](https://img.shields.io/github/v/release/eifeldj/pakethub?sort=semver)](https://github.com/eifeldj/pakethub/releases)
[![Documentation](https://img.shields.io/github/actions/workflow/status/eifeldj/pakethub/docs.yml?branch=main&label=documentation)](https://eifeldj.github.io/pakethub/)
[![HACS](https://img.shields.io/badge/HACS-Custom-41BDF5?logo=homeassistant&logoColor=white)](https://hacs.xyz/)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Custom%20Integration-41BDF5?logo=homeassistant&logoColor=white)](https://www.home-assistant.io/)
[![License](https://img.shields.io/github/license/eifeldj/pakethub)](LICENSE)
[![Issues](https://img.shields.io/github/issues/eifeldj/pakethub)](https://github.com/eifeldj/pakethub/issues)

**One place for every shipment — with native providers, automatic fallback and a dedicated Home Assistant dashboard card.**

[Website & documentation](https://eifeldj.github.io/pakethub/) · [Installation](#installation) · [Support](#support)

English · [Deutsch](README.de.md)
</div>

---

## Overview

PaketHub is a custom Home Assistant integration for parcel tracking through the official **17TRACK API v2.4**. It adds native carrier support where available, falls back automatically when required and presents normalized shipment data as devices, entities and a purpose-built dashboard card.

**Current integration version / Aktuelle Integrationsversion:** `2.5.1`

## Features

- UI setup and configurable polling interval
- One Home Assistant device per shipment
- Central PaketHub device with counters, synchronization state, API connectivity and refresh button
- Status, location, latest event, last update, ETA, transit days and carrier sensors
- Full tracking history and accessible package-detail timeline
- Native UPS tracking with automatic 17TRACK fallback
- Extensible provider architecture and diagnostics
- Native Lovelace card with automatic shipment discovery
- German and English translations

## Architecture

```text
Tracking number / Trackingnummer
        ↓
Carrier detection / Carrier-Erkennung
        ↓
Native provider ── unavailable/error ──→ 17TRACK fallback
        ↓
Normalized shipment model
        ↓
Home Assistant devices, entities and PaketHub dashboard card
```

## Installation

### HACS

1. Open **HACS** and choose **Custom repositories**.
2. Add `https://github.com/eifeldj/pakethub` as an **Integration**.
3. Install **PaketHub** and restart Home Assistant.
4. Open **Settings → Devices & services → Add integration**.
5. Select PaketHub and enter your official 17TRACK API v2.4 key.

### Manual installation / Manuelle Installation

Copy `custom_components/pakethub` to `/config/custom_components/pakethub`, restart Home Assistant and add PaketHub through the integrations UI.

## Dashboard card

```yaml
type: custom:pakethub-card
title: My packages
show_delivered: false
max_packages: 8
sort_by: status
tap_action: details
```

See [`dashboard/README.md`](dashboard/README.md) for YAML-mode dashboards.

## Actions

```yaml
action: pakethub.add_package
data:
  tracking_number: EXAMPLE1234567890
  package_name: Example order
```

```yaml
action: pakethub.remove_package
data:
  tracking_number: EXAMPLE1234567890
```

```yaml
action: pakethub.refresh
```

## Documentation

**[https://eifeldj.github.io/pakethub/](https://eifeldj.github.io/pakethub/)**

## Contributing and support

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`SUPPORT.md`](SUPPORT.md).

Never publish API keys, full tracking numbers, addresses or private shipment details.

- [Bug report](https://github.com/eifeldj/pakethub/issues/new?template=bug_report.yml)
- [Feature request](https://github.com/eifeldj/pakethub/issues/new?template=feature_request.yml)
- [Native provider request](https://github.com/eifeldj/pakethub/issues/new?template=provider_request.yml)
- [Security policy](SECURITY.md)

## Project links

[Documentation](https://eifeldj.github.io/pakethub/) · [Releases](https://github.com/eifeldj/pakethub/releases) · [Roadmap](https://eifeldj.github.io/pakethub/roadmap/) · [Changelog](CHANGELOG.md) · [License](LICENSE)

<div align="center"><sub>Created and maintained by Volker Moeltgen · <a href="https://github.com/eifeldj">@eifeldj</a></sub></div>
