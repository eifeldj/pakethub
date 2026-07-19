# PaketHub

PaketHub is a custom Home Assistant integration for parcel tracking. The first provider is the official 17TRACK API v2.4.

> **Project status:** Early development release. The integration currently supports one 17TRACK account per Home Assistant instance.

## Features

- Setup through the Home Assistant user interface
- Automatic retrieval of registered 17TRACK shipments
- A separate Home Assistant device for every shipment
- Seven sensors per shipment:
  - status
  - location
  - latest event
  - last update
  - days in transit
  - estimated delivery
  - carrier
- Full tracking history in the status sensor attributes
- Configurable update interval
- Home Assistant actions for adding, removing and refreshing shipments
- German and English translations

## Requirements

You need a valid API key for the official 17TRACK API v2.4. The API key is not the password for the normal 17TRACK website.

## Installation with HACS

1. Open **HACS** in Home Assistant.
2. Open the three-dot menu and select **Custom repositories**.
3. Add `https://github.com/eifeldj/pakethub` as an **Integration**.
4. Search for **PaketHub** and install it.
5. Restart Home Assistant.
6. Open **Settings → Devices & services → Add integration** and select **PaketHub**.
7. Enter your 17TRACK API key.

## Manual installation

Copy the directory:

```text
custom_components/pakethub
```

to:

```text
/config/custom_components/pakethub
```

Restart Home Assistant and add PaketHub from **Settings → Devices & services**.

## Actions

### Add a shipment

```yaml
action: pakethub.add_package
data:
  tracking_number: YT2637821437895478
  package_name: Bambu Lab
```

### Remove a shipment

The carrier code is optional.

```yaml
action: pakethub.remove_package
data:
  tracking_number: YT2637821437895478
```

### Refresh immediately

```yaml
action: pakethub.refresh
```

## Updating from TrackHub

PaketHub uses a new Home Assistant integration domain. Remove the previous `trackhub` integration and directory before installing PaketHub:

```text
/config/custom_components/trackhub
```

After restarting Home Assistant, install and configure PaketHub again. Existing shipments remain registered in your 17TRACK account and will be imported automatically.

## Roadmap

- Central PaketHub device and diagnostic sensors
- Refresh button entity
- Improved status icons
- Tracking timeline improvements
- Notifications
- Support for additional parcel-tracking providers

## Support

Please report bugs and feature requests through the GitHub issue tracker. Do not include API keys or private shipment information in issues or logs.

## License

PaketHub is licensed under the MIT License.
