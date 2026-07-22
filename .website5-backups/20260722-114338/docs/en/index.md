---
hide:
  - navigation
  - toc
description: PaketHub brings intelligent parcel tracking to Home Assistant.
---

<div class="ph4-home">
<section class="ph4-hero">
<div markdown>
<span class="ph4-eyebrow">:material-home-assistant: Built for Home Assistant</span>

# Parcel tracking, <span class="ph4-gradient-text">finally at home.</span>

<div class="ph4-hero-lead">PaketHub unifies 17TRACK, native providers, automatic fallback, diagnostics and a dedicated dashboard experience in one integration.</div>

<div class="ph4-actions">
[Install PaketHub](installation.md){ .md-button .md-button--primary }
[Explore documentation](quickstart.md){ .md-button }
[GitHub](https://github.com/eifeldj/pakethub){ .md-button }
</div>

<div class="ph4-trust"><span>✓ Native-first tracking</span><span>✓ Automatic fallback</span><span>✓ Open Source</span></div>
</div>

<div class="ph4-dashboard" data-demo-root>
<div class="ph4-dashboard-head"><div class="ph4-dashboard-title">📦 PaketHub</div><div class="ph4-live">LIVE</div></div>
<div class="ph4-demo-tabs"><button class="ph4-demo-tab is-active" data-demo-filter="all">All</button><button class="ph4-demo-tab" data-demo-filter="active">Active</button><button class="ph4-demo-tab" data-demo-filter="delivered">Delivered</button></div>
<div class="ph4-package-list">
<div class="ph4-package" data-demo-state="active"><div class="ph4-package-icon">↗</div><div><strong>Coffee order</strong><small>UPS · In transit · Vienna</small><div class="ph4-progress"><span style="width:72%"></span></div></div><div class="ph4-package-meta">Tomorrow</div></div>
<div class="ph4-package" data-demo-state="active"><div class="ph4-package-icon">⌁</div><div><strong>Home Assistant hardware</strong><small>17TRACK · Customs cleared</small><div class="ph4-progress"><span style="width:49%"></span></div></div><div class="ph4-package-meta">ETA</div></div>
<div class="ph4-package" data-demo-state="delivered"><div class="ph4-package-icon">✓</div><div><strong>Printer accessories</strong><small>Delivered</small><div class="ph4-progress"><span style="width:100%"></span></div></div><div class="ph4-package-meta">Delivered</div></div>
</div></div>
</section>

<section class="ph4-section ph4-reveal"><div class="ph4-stats"><div class="ph4-stat"><strong>2</strong><span>tracking providers</span></div><div class="ph4-stat"><strong>2</strong><span>languages</span></div><div class="ph4-stat"><strong id="ph4-stars">—</strong><span>GitHub Stars</span></div><div class="ph4-stat"><strong id="ph4-version">Latest</strong><span>release</span></div></div></section>

<section class="ph4-section ph4-reveal"><div class="ph4-section-head" markdown><div class="ph4-kicker">Why PaketHub</div>

## Every shipment. One consistent experience.

PaketHub keeps carrier-specific complexity behind a consistent model designed for Home Assistant.
</div>
<div class="ph4-feature-grid">
<div class="ph4-card"><div class="ph4-card-icon">◎</div><h3>Smart provider selection</h3><p>Automatic selection between native tracking and fallback.</p></div>
<div class="ph4-card"><div class="ph4-card-icon">▦</div><h3>Purpose-built dashboard</h3><p>Active and delivered shipments stay readable.</p></div>
<div class="ph4-card"><div class="ph4-card-icon">⌁</div><h3>Transparent diagnostics</h3><p>Provider usage and fallbacks stay understandable.</p></div>
<div class="ph4-card"><div class="ph4-card-icon">◉</div><h3>Automation ready</h3><p>Use shipment changes directly in Home Assistant.</p></div>
<div class="ph4-card"><div class="ph4-card-icon">◇</div><h3>Privacy conscious</h3><p>Sensitive information stays protected.</p></div>
<div class="ph4-card"><div class="ph4-card-icon">＋</div><h3>Extensible</h3><p>Additional native carriers can be added.</p></div>
</div></section>

<section class="ph4-section ph4-reveal"><div class="ph4-split"><div><div class="ph4-kicker">HACS</div><h2>Installed in minutes</h2><p>Add the repository, download PaketHub and restart Home Assistant.</p></div><div class="ph4-panel"><div class="ph4-code">https://github.com/eifeldj/pakethub<button class="ph4-copy" data-copy-value="https://github.com/eifeldj/pakethub" data-copy-success="Copied">Copy</button></div><p>[Open installation guide →](installation.md)</p></div></div></section>

<section class="ph4-section ph4-reveal"><div class="ph4-split"><div class="ph4-panel"><div class="ph4-kicker">Provider intelligence</div><h2>Native when possible. Fallback when needed.</h2><div class="ph4-provider-controls"><button class="ph4-provider-button is-active" data-provider="ups">UPS</button><button class="ph4-provider-button" data-provider="unknown">Unknown</button><button class="ph4-provider-button" data-provider="fail">Failure</button></div><div class="ph4-provider-result"><span data-provider-result>UPS native provider selected</span><span class="ph4-provider-badge" data-provider-badge data-state="native">Native</span></div></div><div class="ph4-panel"><div class="ph4-kicker">Interactive tracking</div><h2>Watch the shipment move.</h2><div class="ph4-timeline"><div class="ph4-timeline-step"><div><strong>Registered</strong><br><small>17TRACK registry</small></div></div><div class="ph4-timeline-step"><div><strong>Carrier detected</strong><br><small>Provider detection</small></div></div><div class="ph4-timeline-step"><div><strong>In transit</strong><br><small>Normalized state</small></div></div><div class="ph4-timeline-step"><div><strong>Delivered</strong><br><small>Entity update</small></div></div></div><button class="ph4-run-button" data-run-timeline>Run demo</button></div></div></section>

<section class="ph4-section ph4-reveal"><div class="ph4-section-head" markdown><div class="ph4-kicker">Ecosystem</div>

## Providers today and tomorrow
</div><div class="ph4-provider-grid"><div class="ph4-provider-card"><strong>17TRACK</strong><br><span>Registry and fallback</span><br><span class="ph4-provider-state ready">Available</span></div><div class="ph4-provider-card"><strong>UPS</strong><br><span>Native provider</span><br><span class="ph4-provider-state ready">Available</span></div><div class="ph4-provider-card"><strong>DHL</strong><br><span>Future provider</span><br><span class="ph4-provider-state planned">Planned</span></div><div class="ph4-provider-card"><strong>More carriers</strong><br><span>Provider framework</span><br><span class="ph4-provider-state planned">Roadmap</span></div></div></section>

<section class="ph4-section ph4-reveal"><div class="ph4-section-head" markdown><div class="ph4-kicker">Architecture</div>

## A clear data flow
</div><div class="ph4-architecture"><div class="ph4-architecture-node">Home Assistant</div><div class="ph4-architecture-node">Coordinator</div><div class="ph4-architecture-node">Detection</div><div class="ph4-architecture-node">Native / Fallback</div><div class="ph4-architecture-node">Entities</div></div><p>[Explore the architecture →](architecture.md)</p></section>

<section class="ph4-section ph4-cta ph4-reveal" markdown>
## Bring your packages home.

Install PaketHub and bring parcel tracking directly into your Home Assistant dashboard.

[Install PaketHub](installation.md){ .md-button .md-button--primary }
</section>

<footer class="ph4-footer"><div class="ph4-footer-grid"><div><h3>PaketHub</h3><p>Parcel tracking for Home Assistant.</p></div><div><h4>Docs</h4><a href="installation/">Installation</a><a href="configuration/">Configuration</a><a href="dashboard-card/">Dashboard</a></div><div><h4>Project</h4><a href="roadmap/">Roadmap</a><a href="releases/">Releases</a><a href="development/">Development</a></div><div><h4>Community</h4><a href="https://github.com/eifeldj/pakethub">GitHub</a><a href="https://github.com/eifeldj/pakethub/issues">Issues</a><a href="https://github.com/eifeldj/pakethub/security">Security</a></div></div><div class="ph4-footer-bottom"><span>© Volker Moeltgen</span><span>Open Source · Home Assistant</span></div></footer>
</div>
