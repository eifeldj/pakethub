# Quick start

After installation:

1. Add PaketHub through the Home Assistant integration UI.
2. Enter the 17TRACK API key.
3. Add a shipment with the `pakethub.add_package` action.
4. Add the PaketHub dashboard card.
5. Open diagnostics when troubleshooting provider behavior.

```yaml
action: pakethub.add_package
data:
  tracking_number: EXAMPLE1234567890
  package_name: Example order
```
