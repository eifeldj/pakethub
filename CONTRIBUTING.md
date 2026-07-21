# Contributing to PaketHub

Thank you for considering a contribution.

## Before you start

- Search existing issues and discussions.
- Keep pull requests focused.
- Explain the user benefit and test the change.
- Update English and German documentation when behavior changes.
- Never commit API keys, complete tracking numbers, addresses or private shipment data.

## Development workflow

1. Fork the repository.
2. Create a feature branch.
3. Implement and test the change.
4. Run the documentation build:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   python -m pip install -r requirements-docs.txt
   mkdocs build --strict
   ```
5. Open a pull request using the repository template.

## Provider contributions

New providers should:

- implement the common provider interface,
- return normalized tracking data,
- record runtime and usage statistics,
- handle errors without exposing secrets,
- support graceful fallback where appropriate,
- include tests and documentation.
