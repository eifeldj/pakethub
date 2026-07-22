---
hide:
  - navigation
  - toc
description: PaketHub brings intelligent parcel tracking to Home Assistant.
---

<div class="ph5-home">

<section class="ph5-hero">
  <div class="ph5-copy">
    <div class="ph5-eyebrow">Built for Home Assistant</div>
    <h1>Parcel tracking,<br><span class="ph5-gradient">finally at home.</span></h1>
    <p class="ph5-lead">PaketHub unifies 17TRACK, native providers, automatic fallback, diagnostics and a dedicated dashboard experience in one integration.</p>
    <div class="ph5-actions">
      <a class="ph5-btn primary" href="installation/">Install PaketHub</a>
      <a class="ph5-btn" href="quickstart/">Explore documentation</a>
      <a class="ph5-btn" href="https://github.com/eifeldj/pakethub">GitHub</a>
    </div>
    <div class="ph5-trust">
      <span>✓ Native-first tracking</span>
      <span>✓ Automatic fallback</span>
      <span>✓ Open Source</span>
    </div>
  </div>

  <div class="ph5-dashboard" data-demo>
    <div class="ph5-dash-head"><span>📦 PaketHub</span><span class="ph5-live">LIVE</span></div>
    <div class="ph5-tabs">
      <button class="ph5-tab active" data-filter="all">All</button>
      <button class="ph5-tab" data-filter="active">Active</button>
      <button class="ph5-tab" data-filter="delivered">Delivered</button>
    </div>
    <div class="ph5-list">
      <div class="ph5-package" data-state="active"><div class="ph5-icon">↗</div><div><strong>Coffee order</strong><small>UPS · In transit · Vienna</small><div class="ph5-progress"><span style="width:72%"></span></div></div><div class="ph5-meta">Tomorrow</div></div>
      <div class="ph5-package" data-state="active"><div class="ph5-icon">⌁</div><div><strong>Home Assistant hardware</strong><small>17TRACK · Customs cleared</small><div class="ph5-progress"><span style="width:49%"></span></div></div><div class="ph5-meta">ETA</div></div>
      <div class="ph5-package" data-state="delivered"><div class="ph5-icon">✓</div><div><strong>Printer accessories</strong><small>Delivered</small><div class="ph5-progress"><span style="width:100%"></span></div></div><div class="ph5-meta">Delivered</div></div>
    </div>
  </div>
</section>

<section class="ph5-section ph5-reveal">
  <div class="ph5-stats">
    <div class="ph5-stat"><strong>2</strong><span>tracking providers</span></div>
    <div class="ph5-stat"><strong>2</strong><span>languages</span></div>
    <div class="ph5-stat"><strong id="ph5-stars">—</strong><span>GitHub Stars</span></div>
    <div class="ph5-stat"><strong id="ph5-version">Latest</strong><span>release</span></div>
  </div>
</section>

<section class="ph5-section ph5-reveal">
  <div class="ph5-kicker">Why PaketHub</div>
  <h2 class="ph5-title">Every shipment. One consistent experience.</h2>
  <div class="ph5-grid">
    <article class="ph5-card"><div class="ph5-card-icon">◎</div><h3>Smart provider selection</h3><p>Automatic selection between native tracking and fallback.</p></article>
    <article class="ph5-card"><div class="ph5-card-icon">▦</div><h3>Purpose-built dashboard</h3><p>Active, delayed and delivered shipments stay readable.</p></article>
    <article class="ph5-card"><div class="ph5-card-icon">⌁</div><h3>Transparent diagnostics</h3><p>Provider usage and fallbacks stay understandable.</p></article>
    <article class="ph5-card"><div class="ph5-card-icon">◉</div><h3>Automation ready</h3><p>Use shipment state changes directly in Home Assistant.</p></article>
    <article class="ph5-card"><div class="ph5-card-icon">◇</div><h3>Privacy conscious</h3><p>Sensitive information stays out of public diagnostics.</p></article>
    <article class="ph5-card"><div class="ph5-card-icon">＋</div><h3>Extensible</h3><p>Additional native carriers can be added.</p></article>
  </div>
</section>

<section class="ph5-section ph5-reveal">
  <div class="ph5-split">
    <div><div class="ph5-kicker">HACS</div><h2 class="ph5-title">Installed in minutes</h2><p>Add the repository, download PaketHub and restart Home Assistant.</p></div>
    <div class="ph5-panel"><div class="ph5-code">https://github.com/eifeldj/pakethub<button class="ph5-copy-btn" data-copy="https://github.com/eifeldj/pakethub" data-success="Copied">Copy</button></div><p><a href="installation/">Open installation guide &rarr;</a></p></div>
  </div>
</section>

<section class="ph5-section ph5-reveal">
  <div class="ph5-split">
    <div class="ph5-panel">
      <div class="ph5-kicker">Provider intelligence</div>
      <h2>Native when possible. Fallback when needed.</h2>
      <div class="ph5-provider-controls"><button class="ph5-provider-btn active" data-provider="ups">UPS</button><button class="ph5-provider-btn" data-provider="unknown">Unknown</button><button class="ph5-provider-btn" data-provider="fail">Failure</button></div>
      <div class="ph5-provider-result"><span data-provider-result>UPS native provider selected</span><span class="ph5-badge" data-provider-badge data-state="native">Native</span></div>
    </div>
    <div class="ph5-panel">
      <div class="ph5-kicker">Interactive tracking</div>
      <h2>Watch the shipment move.</h2>
      <div class="ph5-timeline">
        <div class="ph5-step"><div><strong>Registered</strong><br><small>17TRACK registry</small></div></div>
        <div class="ph5-step"><div><strong>Carrier detected</strong><br><small>Provider detection</small></div></div>
        <div class="ph5-step"><div><strong>In transit</strong><br><small>Normalized state</small></div></div>
        <div class="ph5-step"><div><strong>Delivered</strong><br><small>Entity update</small></div></div>
      </div>
      <button class="ph5-run" data-run>Run demo</button>
    </div>
  </div>
</section>

<section class="ph5-section ph5-reveal">
  <div class="ph5-kicker">Ecosystem</div>
  <h2 class="ph5-title">Providers today and tomorrow</h2>
  <div class="ph5-providers">
    <div class="ph5-provider-card"><strong>17TRACK</strong><br><span>Registry and fallback</span><br><span class="ph5-state ready">Available</span></div>
    <div class="ph5-provider-card"><strong>UPS</strong><br><span>Native provider</span><br><span class="ph5-state ready">Available</span></div>
    <div class="ph5-provider-card"><strong>DHL</strong><br><span>Future provider</span><br><span class="ph5-state planned">Planned</span></div>
    <div class="ph5-provider-card"><strong>More carriers</strong><br><span>Provider framework</span><br><span class="ph5-state planned">Roadmap</span></div>
  </div>
</section>

<section class="ph5-section ph5-reveal">
  <div class="ph5-kicker">Architecture</div>
  <h2 class="ph5-title">A clear data flow</h2>
  <div class="ph5-architecture">
    <div class="ph5-node">Home Assistant</div>
    <div class="ph5-node">Coordinator</div>
    <div class="ph5-node">Detection</div>
    <div class="ph5-node">Native / Fallback</div>
    <div class="ph5-node">Entities</div>
  </div>
</section>

<section class="ph5-section ph5-cta ph5-reveal">
  <h2>Bring your packages home.</h2>
  <p>Install PaketHub and bring parcel tracking directly into your Home Assistant dashboard.</p>
  <a class="ph5-btn primary" href="installation/">Install PaketHub</a>
</section>

<footer class="ph5-footer">
  <div class="ph5-footer-grid">
    <div><h3>PaketHub</h3><p>Parcel tracking for Home Assistant.</p></div>
    <div><h4>Docs</h4><a href="installation/">Installation</a><a href="configuration/">Configuration</a><a href="dashboard-card/">Dashboard</a></div>
    <div><h4>Project</h4><a href="roadmap/">Roadmap</a><a href="releases/">Releases</a><a href="development/">Development</a></div>
    <div><h4>Community</h4><a href="https://github.com/eifeldj/pakethub">GitHub</a><a href="https://github.com/eifeldj/pakethub/issues">Issues</a><a href="https://github.com/eifeldj/pakethub/security">Security</a></div>
  </div>
  <div class="ph5-footer-bottom"><span>© Volker Moeltgen</span><span>Open Source · Home Assistant</span></div>
</footer>

</div>
