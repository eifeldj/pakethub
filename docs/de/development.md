# Entwicklung

```text
providers/
├── base.py
├── manager.py
├── autodetect.py
├── seventeentrack.py
└── ups.py
```

Neue Provider sollen die gemeinsame Schnittstelle implementieren, Trackingdaten normalisieren, Laufzeitstatistiken erfassen und einen sauberen Fallback unterstützen.

Das Integrationsmanifest ist die maßgebliche Versionsquelle. Das Frontend sollte dieselbe Version für Anzeige und Cache-Busting verwenden.
