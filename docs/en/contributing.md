# Contributing

Contributions are welcome.

## Before opening a change

1. Search existing issues and discussions.
2. Keep changes focused and explain the user benefit.
3. Update English and German documentation when behavior changes.
4. Do not commit credentials, tracking numbers or personal shipment data.

## Documentation preview

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-docs.txt
mkdocs serve
```

Open the local address shown by MkDocs.

## Documentation validation

```bash
mkdocs build --strict
```

The same strict build is run by GitHub Actions before deployment.
