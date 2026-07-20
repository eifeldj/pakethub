# PaketHub v2.1.1

This maintenance release fixes the remaining search-field focus issues in PaketHub 2.1.

## Fixed

- Search input no longer loses focus after typing several characters.
- Backspace can be used continuously without clicking the field again.
- Cursor position remains stable while filtering.
- Home Assistant global keyboard shortcuts no longer receive search-field events.

## Technical improvement

Package filtering now updates the visibility of existing package cards instead of rebuilding the complete card after every keystroke.

Created and maintained by **Volker Moeltgen**.
