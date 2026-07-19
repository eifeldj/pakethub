# Changelog

## 0.7.0

- Eigene Lovelace-Karte `custom:pakethub-card`
- Automatische Erkennung aller PaketHub-Sendungen
- Fortschrittsbalken, Status, Paketdienst, ETA, Standort und letztes Ereignis
- Filter für zugestellte Pakete und maximale Anzahl
- Sortierung nach Status, ETA oder Paketname
- Visueller Karteneditor
- Automatische Ressourcenregistrierung im Lovelace-Storage-Modus
- Manuelle Ressourcenoption für YAML-Dashboards


All notable changes to PaketHub are documented in this file.

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
