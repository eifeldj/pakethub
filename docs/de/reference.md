# Referenz

## Integration

PaketHub wird über die Home-Assistant-Integrationsoberfläche konfiguriert und verwendet einen offiziellen 17TRACK-API-Schlüssel v2.4.

## Aktionen

### `pakethub.add_package`

Registriert eine Sendung.

```yaml
action: pakethub.add_package
data:
  tracking_number: EXAMPLE1234567890
  package_name: Beispielbestellung
```

### `pakethub.remove_package`

Entfernt eine verfolgte Sendung.

```yaml
action: pakethub.remove_package
data:
  tracking_number: EXAMPLE1234567890
```

### `pakethub.refresh`

Fordert eine Aktualisierung an.

```yaml
action: pakethub.refresh
```

## Übliche Sendungsinformationen

Abhängig vom Provider kann PaketHub Folgendes bereitstellen:

- Sendungsname,
- Trackingnummer,
- Carrier,
- normalisierter Status,
- letzter Standort,
- erwartete Zustellung,
- Fortschritt,
- Ereignisverlauf,
- für das letzte Ergebnis verwendeter Provider.

!!! warning "Achtung"
    Die genauen Entitäten und Attribute werden durch die installierte PaketHub-Version bestimmt. Prüfe das aktuelle Modell unter **Entwicklerwerkzeuge → Zustände**.
