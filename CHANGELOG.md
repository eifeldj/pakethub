# Changelog

## 1.1.0

- Added carrier-specific visual badges for common parcel services
- Added a prominent ETA block to every package card
- Added an inline copy action for tracking numbers
- Increased spacing and improved keyboard accessibility
- Localized the dashboard card automatically for German and English Home Assistant installations
- Included the package detail dialog, chronological tracking timeline, 17TRACK link and Home Assistant details action
- Changed the primary project documentation to English and added a separate German README
- Unified integration, frontend resource and dashboard card versions at 1.1.0

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
