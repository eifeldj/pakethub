# PaketHub

![PaketHub – Paketverfolgung für Home Assistant](images/hacs-banner.png)

PaketHub ist eine benutzerdefinierte Home-Assistant-Integration zur Paketverfolgung über die offizielle 17TRACK API v2.4.

**Version 1.0.0** enthält eine vollständige native Lovelace-Oberfläche mit Paketkarten, Detailansicht, chronologischer Tracking-Timeline, kopierbarer Trackingnummer und direktem Link zu 17TRACK.

> English documentation: [README.md](README.md)

## Funktionen

- Einrichtung über die Home-Assistant-Benutzeroberfläche
- Einstellbares Aktualisierungsintervall
- Automatischer Import der Sendungen eines 17TRACK-Kontos
- Ein Home-Assistant-Gerät pro Sendung
- Sensoren für Status, Standort, letztes Ereignis, letzte Aktualisierung, ETA, Transporttage und Paketdienst
- Vollständiger Sendungsverlauf in den Attributen des Statussensors
- Native Lovelace-Karte mit automatischer Erkennung aller PaketHub-Sendungen
- Paketdetailansicht mit chronologischer Tracking-Timeline
- Kopierbare Trackingnummer und direkter Link zu 17TRACK
- Zentrales PaketHub-Gerät mit Paketstatistik und API-Verbindungsstatus
- Aktualisierungsschaltfläche sowie Aktionen zum Hinzufügen, Entfernen und Aktualisieren von Sendungen
- Dynamische Symbole für Sendungszustände
- Datenschutzfreundliche Diagnoseinformationen
- Deutsche und englische Übersetzungen

## Installation mit HACS

1. **HACS** in Home Assistant öffnen.
2. Im Drei-Punkte-Menü **Benutzerdefinierte Repositories** auswählen.
3. `https://github.com/eifeldj/pakethub` als **Integration** hinzufügen.
4. Nach **PaketHub** suchen und installieren.
5. Home Assistant neu starten.
6. **Einstellungen → Geräte & Dienste → Integration hinzufügen** öffnen.
7. **PaketHub** auswählen und den 17TRACK-API-Schlüssel eingeben.

## Native Dashboard-Karte

Bei Dashboards im Storage-Modus wird die JavaScript-Ressource automatisch registriert. Die Karte kann direkt über den visuellen Karteneditor hinzugefügt werden.

```yaml
type: custom:pakethub-card
title: Meine Pakete
show_delivered: false
max_packages: 8
sort_by: status
tap_action: details
```

### Kartenoptionen

| Option | Standard | Beschreibung |
|---|---:|---|
| `title` | `PaketHub` | Titel der Karte |
| `show_delivered` | `false` | Zugestellte Sendungen anzeigen |
| `max_packages` | `8` | Maximale Anzahl sichtbarer Sendungen |
| `sort_by` | `status` | Sortierung nach `status`, `eta` oder `name` |
| `tap_action` | `details` | `details`, `url` oder `more-info` |

`details` öffnet die PaketHub-Timeline, `url` öffnet 17TRACK und `more-info` zeigt den Home-Assistant-Entitätsdialog.

Weitere Hinweise zu YAML-Dashboards stehen in [dashboard/README.md](dashboard/README.md).

## Aktionen

```yaml
action: pakethub.add_package
data:
  tracking_number: YT2637821437895478
  package_name: Bambu Lab
```

```yaml
action: pakethub.remove_package
data:
  tracking_number: YT2637821437895478
```

```yaml
action: pakethub.refresh
```

## Support und Datenschutz

Fehler können über den GitHub Issue Tracker gemeldet werden. API-Schlüssel, vollständige Trackingnummern, Adressen oder private Sendungsdetails dürfen nicht in öffentliche Issues eingefügt werden.

## Lizenz

PaketHub wird unter der [MIT-Lizenz](LICENSE) veröffentlicht.
