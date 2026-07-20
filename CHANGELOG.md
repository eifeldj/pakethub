## 2.1.0

- Added status filters for All, Active, In transit, Delivered, Problems and Favorites.
- Delivered packages can now be viewed on demand without cluttering the active overview.
- Added a delivered package count directly to the archive filter.
- Improved responsive filter controls for narrow Home Assistant dashboard columns.

## 2.0.2

- Added package management directly in the dashboard.
- Added inline expandable tracking timelines.
- Added add, rename and delete actions.
- Added local favorites, search and favorites filtering.
- Added the `pakethub.rename_package` service and 17TRACK tag update support.

## 2.0.2

### UI polish
- Prevent duplicate carrier names when a carrier logo already contains its wordmark.
- Improve carrier logo sizing and alignment.
- Limit package titles to two readable lines across all card widths.
- Make status badges more compact.
- Increase progress bar weight and add a subtle status glow.
- Add a restrained carrier-colour tint to package content areas.

# Changelog

## 2.0.2

### Improved package-card layout
- Package names can now wrap across multiple lines instead of being truncated.
- Tracking suffix and copy control are grouped separately so they no longer squeeze the title.
- The latest tracking status is displayed in full and is no longer line-clamped.
- Added a relative timestamp below the latest status.
- ETA and location now use matching information tiles.
- Reduced the carrier column width to give shipment details more room.
- Added container-query based responsive layouts so cards adapt to their actual dashboard column width, not only the browser viewport.
- Improved narrow-column and mobile layouts while preserving the accessible details dialog.

## 1.2.0

### Added
- New wide package-card layout with a dedicated carrier brand panel.
- Built-in branded carrier marks and official brand colors for Austrian Post, DHL, UPS, FedEx, GLS, DPD, Amazon Logistics, YunExpress, Hermes/Evri, Royal Mail and USPS.
- Clear chevron affordance for opening package details.

### Improved
- More generous right-side spacing and a longer, easier-to-read progress bar.
- Larger package titles, ETA panels and location information.
- Responsive layout: carrier panel becomes a compact header on tablets and phones.
- Refined card borders, gradients, hover states and spacing for current Home Assistant themes.
- Existing accessible dialog, keyboard navigation and focus handling retained.

## 1.1.1

- Added carrier-specific visual badges for common parcel services
- Added a prominent ETA block to every package card
- Added an inline copy action for tracking numbers
- Increased spacing and improved keyboard accessibility
- Localized the dashboard card automatically for German and English Home Assistant installations
- Included the package detail dialog, chronological tracking timeline, 17TRACK link and Home Assistant details action
- Changed the primary project documentation to English and added a separate German README
- Unified integration, frontend resource and dashboard card versions at 1.1.1

## 0.9.1

- Vollständiges Release-Paket für PaketHub 0.9.1 erstellt
- Integrations-, Dashboard- und Ressourcen-Version auf 0.9.1 vereinheitlicht
- Browser-Cache-Buster der automatisch registrierten Lovelace-Ressource auf `?v=0.9.1` aktualisiert
- Paket-Detailansicht, Tracking-Timeline, Kopierfunktion und 17TRACK-Link aus 0.9.0 unverändert übernommen
- Branding-Dateien, Dokumentation und Übersetzungen vollständig in das Release-Paket aufgenommen
- Release-Archiv von temporären Dateien und Python-Caches bereinigt

## 0.9.0

- Neue native PaketHub-Detailansicht beim Antippen einer Sendung
- Chronologische Tracking-Timeline mit Datum, Uhrzeit, Status, Standort und Paketdienst
- Aktuellstes Tracking-Ereignis wird hervorgehoben
- Trackingnummer kann direkt kopiert werden
- Direkte Schaltflächen zu 17TRACK und zu den Home-Assistant-Entitätsdetails
- Neues PaketHub-Branding mit Icon und HACS-Banner
- Dashboard- und Ressourcen-Version auf 0.9.0 aktualisiert

## 0.8.1

- Frontend-Registrierung auf Version 0.8.1 aktualisiert
- Automatisch registrierte Lovelace-Ressource verwendet nun `?v=0.8.1`
- Versionsnummern in Manifest, Frontend-Registrierung und Dashboard-Karte vereinheitlicht
- Verhindert das Laden der alten Karten-Version aus dem Browser-Cache

## 0.8.0

- Neuer Smart Header mit Paketübersicht und relativem Synchronisierungszeitpunkt
- Manueller Refresh-Button direkt in der PaketHub-Karte
- Automatische Unterscheidung gleichnamiger Sendungen über die letzten vier Stellen der Trackingnummer
- Neue farbige Status-Chips
- Statusabhängige Farben für Icons und Fortschrittsbalken
- Kompakte ETA-Anzeige: Heute, Morgen, Wochentag oder Keine ETA
- Verbessertes responsives Layout für Smartphone und Tablet

## 0.7.0

- Eigene Lovelace-Karte `custom:pakethub-card`
- Automatische Erkennung aller PaketHub-Sendungen
- Fortschrittsbalken, Status, Paketdienst, ETA, Standort und letztes Ereignis
- Filter für zugestellte Pakete und maximale Anzahl
- Sortierung nach Status, ETA oder Paketname
- Visueller Karteneditor
- Automatische Ressourcenregistrierung im Lovelace-Storage-Modus
- Manuelle Ressourcenoption für YAML-Dashboards
