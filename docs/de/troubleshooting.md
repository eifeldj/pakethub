# Fehlerbehebung

## Integration ist nicht sichtbar

Prüfe, ob `custom_components/pakethub` vorhanden ist, und starte Home Assistant neu.

## Dashboard-Karte ist veraltet

Lade den Browser ohne Cache neu.

## Nativer Provider schlägt fehl

PaketHub sollte automatisch auf 17TRACK zurückfallen. Prüfe die Logs zur Provider-Auswahl und zum Fallback.

## Sendungen werden nicht aktualisiert

Prüfe API-Schlüssel, Netzwerkzugriff, Abfrageintervall, Rate-Limit-Meldungen, Diagnose und Logs.
