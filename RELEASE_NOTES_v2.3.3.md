# PaketHub v2.3.3

## Fehlerbehebung

- Beim Löschen einer Sendung über das PaketHub-Dashboard werden nun auch alle zugehörigen Entitäten aus der Home-Assistant-Entity-Registry entfernt.
- Das dazugehörige Sendungsgerät wird anschließend aus der Device Registry gelöscht.
- PaketHub wird nach dem Löschvorgang automatisch neu geladen, damit keine verwaisten oder nicht verfügbaren Entitäten zurückbleiben.

## Geänderte Dateien

- `custom_components/pakethub/services.py`
- `custom_components/pakethub/manifest.json`
