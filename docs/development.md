# Development

Typical provider structure:

```text
providers/
├── base.py
├── manager.py
├── autodetect.py
├── seventeentrack.py
└── ups.py
```

The integration manifest is the authoritative version source. Frontend resources should use the same version for display and cache busting.

New providers should implement the common interface, return normalized tracking data, record runtime statistics and support graceful fallback.
