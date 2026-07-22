---
hide:
  - navigation
  - toc
description: PaketHub brings intelligent, native parcel tracking to Home Assistant.
---

<div class="ph4-home">

<section class="ph4-hero">
<div class="ph4-orb one"></div>
<div class="ph4-orb two"></div>

<div markdown>
<span class="ph4-eyebrow">:material-home-assistant: Built for Home Assistant</span>

# Parcel tracking, <span class="ph4-gradient-text">finally at home.</span>

<div class="ph4-hero-lead">PaketHub unifies 17TRACK, native carrier providers, automatic fallback, diagnostics, automations and a dedicated dashboard experience in one Home Assistant integration.</div>

<div class="ph4-actions">
[Install PaketHub](installation.md){ .md-button .md-button--primary }
[Explore documentation](quickstart.md){ .md-button }
[View on GitHub](https://github.com/eifeldj/pakethub){ .md-button }
</div>

<div class="ph4-trust">
<span>:material-check-circle: Native-first tracking</span>
<span>:material-check-circle: Automatic fallback</span>
<span>:material-check-circle: Open source</span>
</div>
</div>

<div class="ph4-dashboard" data-demo-root>
  <div class="ph4-dashboard-head">
    <div class="ph4-dashboard-title">📦 PaketHub</div>
    <div class="ph4-live">LIVE</div>
  </div>

  <div class="ph4-demo-tabs">
    <button class="ph4-demo-tab is-active" data-demo-filter="all">All</button>
    <button class="ph4-demo-tab" data-demo-filter="active">Active</button>
    <button class="ph4-demo-tab" data-demo-filter="delivered">Delivered</button>
  </div>

  <div class="ph4-package-list">
    <div class="ph4-package" data-demo-state="active">
      <div class="ph4-package-icon">↗</div>
      <div>
        <strong>Coffee order</strong>
        <small>UPS · In transit · Vienna</small>
        <div class="ph4-progress"><span style="width:72%"></span></div>
      </div>
      <div class="ph4-package-meta">Tomorrow</div>
    </div>

    <div class="ph4-package" data-demo-state="active">
      <div class="ph4-package-icon">⌁</div>
      <div>
        <strong>Home Assistant hardware</strong>
        <small>17TRACK · Customs cleared</small>
        <div class="ph4-progress"><span style="width:49%"></span></div>
      </div>
      <div class="ph4-package-meta">ETA pending</div>
    </div>

    <div class="ph4-package" data-demo-state="delivered">
      <div class="ph4-package-icon">✓</div>
      <div>
        <strong>Printer accessories</strong>
        <small>Delivered · Front door</small>
        <div class="ph4-progress"><span style="width:100%"></span></div>
      </div>
      <div class="ph4-package-meta">Delivered</div>
    </div>
  </div>
</div>
</section>

<section class="ph4-section ph4-reveal">
<div class="ph4-stats">
  <div class="ph4-stat"><strong data-count="2">2</strong><span>tracking providers</span></div>
  <div class="ph4-stat"><strong data-count="2">2</strong><span>documentation languages</span></div>
  <div class="ph4-stat"><strong id="ph4-stars">—</strong><span>GitHub stars</span></div>
  <div class="ph4-stat"><strong id="ph4-version">Latest</strong><span>current release</span></div>
</div>
</section>

<section class="ph4-section ph4-reveal">
<div class="ph4-section-head" markdown>
<div class="ph4-kicker">Why PaketHub</div>

## Every shipment. One consistent experience.

PaketHub keeps carrier-specific complexity behind a consistent model designed for Home Assistant.
</div>

<div class="ph4-feature-grid">
  <div class="ph4-card"><div class="ph4-card-icon">:material-radar:</div><h3>Smart provider selection</h3><p>PaketHub detects the best provider and automatically chooses between native tracking and fallback.</p></div>
  <div class="ph4-card"><div class="ph4-card-icon">:material-view-dashboard-variant:</div><h3>Purpose-built dashboard</h3><p>Active, delayed and delivered shipments remain readable across desktop and mobile.</p></div>
  <div class="ph4-card"><div class="ph4-card-icon">:material-chart-timeline-variant-shimmer:</div><h3>Transparent diagnostics</h3><p>Provider usage, fallbacks, runtimes and synchronization make problems understandable.</p></div>
  <div class="ph4-card"><div class="ph4-card-icon">:material-bell-ring-outline:</div><h3>Automation ready</h3><p>Shipment changes and actions can be used directly in Home Assistant automations.</p></div>
  <div class="ph4-card"><div class="ph4-card-icon">:material-shield-lock-outline:</div><h3>Privacy conscious</h3><p>Credentials and personal shipment information stay out of public diagnostics.</p></div>
  <div class="ph4-card"><div class="ph4-card-icon">:material-puzzle-outline:</div><h3>Built to grow</h3><p>More native carriers can be added without changing the user experience.</p></div>
</div>
</section>

<section class="ph4-section ph4-reveal">
<div class="ph4-split">
  <div>
    <div class="ph4-kicker">Install in minutes</div>
    <h2>Add PaketHub through HACS</h2>
    <p>Add the repository URL, download the integration and restart Home Assistant.</p>
    <div class="ph4-steps">
      <div class="ph4-step"><div><strong>Add repository</strong><br><small>HACS → Integrationen → Custom repositories</small></div></div>
      <div class="ph4-step"><div><strong>Download PaketHub</strong><br><small>Select the latest stable version.</small></div></div>
      <div class="ph4-step"><div><strong>Restart and configure</strong><br><small>Add the integration in Home Assistant.</small></div></div>
    </div>
  </div>

  <div class="ph4-panel">
    <div class="ph4-code">
      https://github.com/eifeldj/pakethub
      <button class="ph4-copy" data-copy-value="https://github.com/eifeldj/pakethub" data-copy-success="Copied">Copy</button>
    </div>
    <p>[Open the full installation guide →](installation.md)</p>
  </div>
</div>
</section>

<section class="ph4-section ph4-reveal">
<div class="ph4-split">
  <div class="ph4-panel">
    <div class="ph4-kicker">Provider intelligence</div>
    <h2>Native when possible. Fallback when needed.</h2>
    <div class="ph4-provider-controls">
      <button class="ph4-provider-button is-active" data-provider="ups">UPS</button>
      <button class="ph4-provider-button" data-provider="unknown">Unknown carrier</button>
      <button class="ph4-provider-button" data-provider="fail">Native failure</button>
    </div>
    <div class="ph4-provider-result">
      <span data-provider-result>UPS native provider selected</span>
      <span class="ph4-provider-badge" data-provider-badge data-state="native">Native</span>
    </div>
  </div>

  <div class="ph4-panel">
    <div class="ph4-kicker">Interactive tracking</div>
    <h2>Watch the shipment move.</h2>
    <div class="ph4-timeline">
      <div class="ph4-timeline-step"><div><strong>Registered</strong><br><small>17TRACK registry</small></div></div>
      <div class="ph4-timeline-step"><div><strong>Carrier detected</strong><br><small>Provider detection</small></div></div>
      <div class="ph4-timeline-step"><div><strong>In transit</strong><br><small>Normalized tracking state</small></div></div>
      <div class="ph4-timeline-step"><div><strong>Delivered</strong><br><small>Home Assistant entity update</small></div></div>
    </div>
    <button class="ph4-run-button" data-run-timeline>Run demo</button>
  </div>
</div>
</section>

<section class="ph4-section ph4-reveal">
<div class="ph4-section-head" markdown>
<div class="ph4-kicker">Provider ecosystem</div>

## Providers today and tomorrow
</div>

<div class="ph4-provider-grid">
  <div class="ph4-provider-card"><strong>17TRACK</strong><span>Registry and fallback</span><br><span class="ph4-provider-state ready">Available</span></div>
  <div class="ph4-provider-card"><strong>UPS</strong><span>Native tracking provider</span><br><span class="ph4-provider-state ready">Available</span></div>
  <div class="ph4-provider-card"><strong>DHL</strong><span>Future native provider</span><br><span class="ph4-provider-state planned">Planned</span></div>
  <div class="ph4-provider-card"><strong>More carriers</strong><span>Extensible framework</span><br><span class="ph4-provider-state planned">Roadmap</span></div>
</div>
</section>

<section class="ph4-section ph4-reveal">
<div class="ph4-section-head" markdown>
<div class="ph4-kicker">Architecture</div>

## A clear data flow
</div>

<div class="ph4-architecture">
  <div class="ph4-architecture-node">Home Assistant</div>
  <div class="ph4-architecture-node">PaketHub Coordinator</div>
  <div class="ph4-architecture-node">Provider Detection</div>
  <div class="ph4-architecture-node">Native / Fallback</div>
  <div class="ph4-architecture-node">Entities & Dashboard</div>
</div>

<p>[Explore the architecture →](architecture.md)</p>
</section>

<section class="ph4-section ph4-faq ph4-reveal" markdown>
<div class="ph4-section-head">
<div class="ph4-kicker">Frequently asked questions</div>

## Questions before your first shipment
</div>

??? question "Do I need a 17TRACK account?"
    Yes. PaketHub currently uses an official 17TRACK API key for registration and fallback tracking.

??? question "What does native provider mean?"
    A native provider communicates directly with a carrier-specific tracking service and normalizes the result.

??? question "What happens when native tracking fails?"
    PaketHub can automatically fall back to 17TRACK.

??? question "Can I automate shipment notifications?"
    Yes. PaketHub is designed for Home Assistant actions, entities and automations.

??? question "Where should I report a problem?"
    Use the structured GitHub issue templates and remove sensitive data first.
</section>

<section class="ph4-section ph4-cta ph4-reveal" markdown>
## Bring your packages home.

Install PaketHub and make parcel tracking part of your Home Assistant dashboard.

[Install PaketHub](installation.md){ .md-button .md-button--primary }
[Read quick start](quickstart.md){ .md-button }
</section>

<footer class="ph4-footer">
  <div class="ph4-footer-grid">
    <div class="ph4-footer-brand">
      <h3>PaketHub</h3>
      <p>Native parcel tracking and provider intelligence for Home Assistant.</p>
    </div>
    <div>
      <h4>Documentation</h4>
      <a href="installation/">Installation</a>
      <a href="configuration/">Configuration</a>
      <a href="dashboard-card/">Dashboard card</a>
    </div>
    <div>
      <h4>Project</h4>
      <a href="roadmap/">Roadmap</a>
      <a href="releases/">Releases</a>
      <a href="development/">Development</a>
    </div>
    <div>
      <h4>Community</h4>
      <a href="https://github.com/eifeldj/pakethub">GitHub</a>
      <a href="https://github.com/eifeldj/pakethub/issues">Issues</a>
      <a href="https://github.com/eifeldj/pakethub/security">Security</a>
    </div>
  </div>

  <div class="ph4-footer-bottom">
    <span>Copyright © Volker Moeltgen</span>
    <span>Open-source software for the Home Assistant community.</span>
  </div>
</footer>

</div>
