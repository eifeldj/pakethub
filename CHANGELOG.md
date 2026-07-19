# Changelog

All notable changes to PaketHub are documented in this file.

## 0.4.0

- Renamed the integration from TrackHub to PaketHub
- Changed the Home Assistant domain from `trackhub` to `pakethub`
- Changed actions to `pakethub.add_package`, `pakethub.remove_package`, and `pakethub.refresh`
- Added repository metadata for HACS and GitHub
- Added German and English translations
- Added migration instructions for existing TrackHub installations

## 0.3.1

- Fixed `async_delete` being defined outside the API class
- Existing shipments no longer cause a hard error when added again
- Checked Python syntax for all integration files

## 0.3.0

- Added actions for adding, removing, and refreshing shipments
- Added native Home Assistant action descriptions

## 0.2.2

- Added seven sensors per shipment
