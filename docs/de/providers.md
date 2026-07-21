# Anbieter

PaketHub trennt die Sendungsregistrierung von der nativen Paketverfolgung.

| Anbieter | Aufgabe | Status |
| --- | --- | --- |
| 17TRACK | Sendungsregister und Fallback-Verfolgung | Unterstützt |
| UPS | Native Verfolgung | Unterstützt |

## Auswahl und Fallback

Der ProviderManager wählt einen geeigneten nativen Anbieter. Kann dieser keine brauchbaren Daten liefern, greift PaketHub automatisch auf 17TRACK zurück.
