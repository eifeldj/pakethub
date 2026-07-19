# PaketHub Dashboard

## Native PaketHub Card (ab 0.7.0)

Nach Installation und Neustart wird die Karte im normalen Dashboard-Karteneditor als **PaketHub Card** angeboten.

```yaml
type: custom:pakethub-card
title: Meine Pakete
show_delivered: false
max_packages: 8
sort_by: status
tap_action: url
```

Optionen:

- `title`: Überschrift der Karte
- `show_delivered`: zugestellte Pakete anzeigen
- `max_packages`: maximale Anzahl sichtbarer Pakete
- `sort_by`: `status`, `eta` oder `name`
- `tap_action`: `url` öffnet 17TRACK, `more-info` öffnet den HA-Dialog

Bei einem Dashboard im YAML-Modus muss die Ressource einmal manuell registriert werden:

```yaml
lovelace:
  resources:
    - url: /pakethub/pakethub-card.js?v=0.7.0
      type: module
```

Die älteren YAML-Beispiele bleiben zusätzlich verfügbar.
