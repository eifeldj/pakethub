# Installation

## HACS

1. Öffne **HACS**.
2. Öffne das Drei-Punkte-Menü und wähle **Benutzerdefinierte Repositories**.
3. Füge `https://github.com/eifeldj/pakethub` als **Integration** hinzu.
4. Suche nach **PaketHub** und installiere es.
5. Starte Home Assistant neu.
6. Öffne **Einstellungen → Geräte & Dienste → Integration hinzufügen**.
7. Wähle **PaketHub** und gib deinen offiziellen 17TRACK-API-Schlüssel v2.4 ein.

## Manuelle Installation

Kopiere `custom_components/pakethub` nach `/config/custom_components/pakethub`, starte Home Assistant neu und füge PaketHub über die Integrationsoberfläche hinzu.

## Aktualisierung

Installiere das Update über HACS und starte Home Assistant neu. Lade den Browser nach Änderungen an der Dashboard-Karte ohne Cache neu.
