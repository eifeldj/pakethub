# Troubleshooting

## Integration is not visible

Confirm that `custom_components/pakethub` exists and restart Home Assistant.

## Dashboard card is outdated

Reload the browser without cache.

## Native provider fails

PaketHub should automatically fall back to 17TRACK. Check provider-selection and fallback logs.

## Shipments do not update

Check the API key, network access, polling interval, rate-limit messages, diagnostics and logs.
