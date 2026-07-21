# Schnellstart

Nach der Installation:

1. Füge PaketHub über die Home-Assistant-Integrationsoberfläche hinzu.
2. Gib den 17TRACK-API-Schlüssel ein.
3. Füge mit `pakethub.add_package` eine Sendung hinzu.
4. Füge die PaketHub-Dashboard-Karte hinzu.
5. Öffne bei Provider-Problemen die Diagnose.

```yaml
action: pakethub.add_package
data:
  tracking_number: EXAMPLE1234567890
  package_name: Beispielbestellung
```
