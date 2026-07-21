# Mitwirken

Beiträge sind willkommen.

## Vor einer Änderung

1. Prüfe bestehende Issues und Diskussionen.
2. Halte Änderungen fokussiert und beschreibe den Nutzen.
3. Aktualisiere bei Verhaltensänderungen die englische und deutsche Dokumentation.
4. Übertrage keine Zugangsdaten, Trackingnummern oder privaten Sendungsdaten.

## Lokale Dokumentationsvorschau

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-docs.txt
mkdocs serve
```

Öffne anschließend die von MkDocs angezeigte lokale Adresse.

## Dokumentation prüfen

```bash
mkdocs build --strict
```

Derselbe strenge Build wird vor der Veröffentlichung auch in GitHub Actions ausgeführt.
