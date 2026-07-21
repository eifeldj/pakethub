# Architektur

PaketHub trennt carrierspezifische Implementierungen von Home-Assistant-Entitäten und Dashboard.

![PaketHub-Architektur](assets/architecture.svg)

## Verarbeitungsablauf

1. 17TRACK bleibt das Sendungsregister.
2. PaketHub erkennt den am besten geeigneten Provider.
3. Ein nativer Provider wird bevorzugt, sofern verfügbar.
4. Fehlende oder unbrauchbare native Ergebnisse lösen den 17TRACK-Fallback aus.
5. Providerspezifische Antworten werden vereinheitlicht.
6. Home-Assistant-Entitäten und Dashboard verwenden das normalisierte Modell.

## Designziele

- vorhersagbares Fallback-Verhalten,
- keine providerspezifische Logik in der Benutzeroberfläche,
- nachvollziehbare Laufzeit- und Provider-Statistiken,
- einfache Erweiterung um weitere Provider,
- sicherer Umgang mit Zugangsdaten und privaten Sendungsdaten.
