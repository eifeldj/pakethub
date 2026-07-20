# PaketHub dashboard card

For storage-mode dashboards, PaketHub registers the JavaScript resource automatically.

For YAML-mode dashboards, add this resource:

```yaml
resources:
  - url: /pakethub/pakethub-card.js?v=1.1.1
    type: module
```

Card example:

```yaml
type: custom:pakethub-card
title: My packages
show_delivered: false
max_packages: 8
sort_by: status
tap_action: details
```

Supported `tap_action` values: `details`, `url`, and `more-info`.
