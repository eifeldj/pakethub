# PaketHub dashboard

## Native PaketHub card

After installation and a Home Assistant restart, **PaketHub Card** is available in the visual dashboard card editor.

```yaml
type: custom:pakethub-card
title: My Packages
show_delivered: false
max_packages: 8
sort_by: status
tap_action: details
```

## Options

- `title`: card title
- `show_delivered`: include delivered shipments
- `max_packages`: maximum number of visible shipments
- `sort_by`: `status`, `eta`, or `name`
- `tap_action`: `details` opens the PaketHub timeline, `url` opens 17TRACK, and `more-info` opens the Home Assistant entity dialog

## YAML-mode dashboards

The resource is registered automatically only for dashboards in storage mode. Add it manually when using YAML mode:

```yaml
lovelace:
  resources:
    - url: /pakethub/pakethub-card.js?v=1.0.0
      type: module
```

The additional YAML examples in this directory remain available for custom layouts.
