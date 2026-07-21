# PaketHub v2.3.4

## Improvements

### Dynamic shipment removal without integration reload

Deleted shipments are now removed dynamically from Home Assistant. The complete PaketHub integration no longer needs to reload after a shipment is deleted.

This results in:

- Faster deletion
- No temporary interruption of PaketHub entities
- No integration reload after deleting a shipment
- Immediate removal of deleted shipment entities

### Automatic orphan cleanup

PaketHub now checks the Home Assistant Entity Registry and Device Registry after updates.

Entities and devices that belong to shipments no longer returned by PaketHub are removed automatically. This also cleans up stale entries left behind by earlier versions, restores, or interrupted deletion operations.

## Changed files

- `custom_components/pakethub/__init__.py`
- `custom_components/pakethub/entity.py`
- `custom_components/pakethub/registry.py`
- `custom_components/pakethub/services.py`
- `custom_components/pakethub/manifest.json`
