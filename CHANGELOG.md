# Changelog

All notable changes to PaketHub are documented in this file.

## 0.6.0

- Added a status-based progress sensor for every shipment
- Added a dedicated timeline event sensor with normalized event attributes
- Enhanced ETA attributes with remaining days, today/tomorrow flags and overdue detection
- Added central counters for deliveries today and parcels out for delivery today
- Added average transit time and packages registered during the last 24 hours
- Added direct 17TRACK links to relevant entity attributes
- Added ready-to-copy Mushroom dashboard examples
- Extended German and English translations

## 0.5.0

- Added a central PaketHub device
- Added total, active, in-transit, delivered and problem package counters
- Added a last synchronization timestamp sensor
- Added an API connectivity binary sensor
- Added a manual refresh button entity
- Added dynamic icons for shipment status sensors
- Added privacy-conscious Home Assistant diagnostics
- Added a shared entity base and linked shipment devices through the central device
- Extended German and English entity translations

## 0.4.0

- Renamed the integration from TrackHub to PaketHub
- Changed the Home Assistant domain from `trackhub` to `pakethub`
- Changed actions to `pakethub.add_package`, `pakethub.remove_package`, and `pakethub.refresh`
- Added repository metadata for HACS and GitHub
- Added German and English translations
- Added migration instructions for existing TrackHub installations
