# PaketHub v2.0.0

PaketHub 2.0 turns the dashboard into a shipment management interface.

## New
- Add shipments directly from the card through the PaketHub Home Assistant service.
- Rename and permanently remove shipments.
- Expand package cards inline to view the tracking timeline.
- Mark shipments as local browser favorites and pin them to the top.
- Search by package name, tracking number, carrier or status text.
- Filter the dashboard to favorites.
- Updated responsive management dialogs and keyboard-accessible controls.

## Backend
- Added `pakethub.rename_package`.
- Added 17TRACK `changetag` API support.
- Existing add, remove and refresh services remain available.

## Upgrade
Restart Home Assistant and hard-refresh the browser after installing.

---

Created and maintained by **Volker Moeltgen**.
