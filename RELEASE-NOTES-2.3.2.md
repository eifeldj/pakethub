# PaketHub v2.3.2

PaketHub 2.3.2 corrects the remaining branding issue that could cause Home Assistant or HACS to display “icon not available”.

## Fixed

- Added local brand assets inside `custom_components/pakethub/brand/`
- Added `icon.png` and `icon@2x.png`
- Added matching dark-mode variants
- Kept the repository-level `brand/` directory required by HACS
- Updated all package versions to 2.3.2

No migration is required. Restart Home Assistant and refresh HACS repository information after updating.
