# Installation

## HACS

1. Open **HACS**.
2. Open the three-dot menu and choose **Custom repositories**.
3. Add `https://github.com/eifeldj/pakethub` as an **Integration**.
4. Search for **PaketHub** and install it.
5. Restart Home Assistant.
6. Open **Settings → Devices & services → Add integration**.
7. Select **PaketHub** and enter the official 17TRACK API v2.4 key.

## Manual installation

Copy `custom_components/pakethub` to `/config/custom_components/pakethub`, restart Home Assistant and add PaketHub through the integrations UI.

## Updating

Install the update through HACS and restart Home Assistant. Reload the browser without cache after dashboard-card changes.
