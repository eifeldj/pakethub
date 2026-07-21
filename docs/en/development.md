# Development

```text
providers/
├── base.py
├── manager.py
├── autodetect.py
├── seventeentrack.py
└── ups.py
```

New providers should implement the common interface, normalize tracking data, record runtime statistics and support graceful fallback.

The integration manifest is the authoritative version source. The frontend should use the same version for display and cache busting.
