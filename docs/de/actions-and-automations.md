# Aktionen und Automationen

## Paket hinzufügen

```yaml
action: pakethub.add_package
data:
  tracking_number: EXAMPLE1234567890
  package_name: Beispielbestellung
```

## Paket entfernen

```yaml
action: pakethub.remove_package
data:
  tracking_number: EXAMPLE1234567890
```

## Aktualisieren

```yaml
action: pakethub.refresh
```
