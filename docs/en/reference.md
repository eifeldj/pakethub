# Reference

## Integration

PaketHub is configured through the Home Assistant integration UI and uses an official 17TRACK API v2.4 key.

## Actions

### `pakethub.add_package`

Registers a shipment.

```yaml
action: pakethub.add_package
data:
  tracking_number: EXAMPLE1234567890
  package_name: Example order
```

### `pakethub.remove_package`

Removes a tracked shipment.

```yaml
action: pakethub.remove_package
data:
  tracking_number: EXAMPLE1234567890
```

### `pakethub.refresh`

Requests an update.

```yaml
action: pakethub.refresh
```

## Common shipment information

Depending on provider availability, PaketHub can expose:

- shipment name,
- tracking number,
- carrier,
- normalized status,
- latest location,
- estimated delivery,
- progress,
- event history,
- provider used for the latest result.

!!! warning
    The exact entities and attributes are defined by the installed PaketHub release. Use Home Assistant's **Developer Tools → States** to inspect the current model.
