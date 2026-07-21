# Troubleshooting

## Integration not visible

Confirm that `custom_components/pakethub` exists and restart Home Assistant.

## Old dashboard-card version

Reload the browser without cache.

## Native provider failure

PaketHub should fall back to 17TRACK. Check provider-selection and fallback logs.

## No shipment updates

Check the API key, network access, polling interval, rate-limit messages, diagnostics and logs.
