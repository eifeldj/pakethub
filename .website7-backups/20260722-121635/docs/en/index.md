---
hide:
  - navigation
  - toc
description: PaketHub brings intelligent parcel tracking to Home Assistant.
---

<div class="ph6-home">

<section class="ph6-hero">
  <div class="ph6-copy">
    <div class="ph6-eyebrow">◆ Built for Home Assistant</div>
    <h1>Smart parcel tracking.<br><span class="ph6-gradient">Native to Home Assistant.</span></h1>
    <p class="ph6-tagline">Native providers first. 17TRACK when needed.</p>
    <p class="ph6-lead">PaketHub automatically chooses the smartest tracking route, normalizes carrier data and makes every shipment visible, automatable and understandable in Home Assistant.</p>
    <div class="ph6-actions">
      <a class="ph6-btn primary" href="installation/">⬇ Install PaketHub</a>
      <a class="ph6-btn" href="quickstart/">▶ Explore documentation</a>
      <a class="ph6-btn" href="https://github.com/eifeldj/pakethub">◆ GitHub</a>
    </div>
    <div class="ph6-trust">
      <span>✓ Native-first tracking</span>
      <span>✓ Automatic fallback</span>
      <span>✓ Open Source</span>
    </div>
  </div>

  <div class="ph6-dashboard-wrap">
    <div class="ph6-float-card one">● Carrier automatically detected</div>
    <div class="ph6-float-card two">✓ Delivery state updated</div>

    <div class="ph6-dashboard" data-ph6-demo>
      <div class="ph6-dash-head">
        <div class="ph6-brand"><span class="ph6-brand-mark">▣</span><span>PaketHub</span></div>
        <span class="ph6-live">LIVE</span>
      </div>

      <div class="ph6-tabs">
        <button class="ph6-tab is-active" data-ph6-filter="all">All</button>
        <button class="ph6-tab" data-ph6-filter="active">Active</button>
        <button class="ph6-tab" data-ph6-filter="delivered">Delivered</button>
      </div>

      <div class="ph6-list">
        <div class="ph6-package" data-ph6-state="active">
          <div class="ph6-package-icon">↗</div>
          <div><strong>Coffee order</strong><small>UPS · In transit · Vienna</small><div class="ph6-progress"><span style="width:72%"></span></div></div>
          <div class="ph6-meta">Tomorrow</div>
        </div>

        <div class="ph6-package" data-ph6-state="active">
          <div class="ph6-package-icon">⌁</div>
          <div><strong>Home Assistant hardware</strong><small>17TRACK · Customs cleared</small><div class="ph6-progress"><span style="width:49%"></span></div></div>
          <div class="ph6-meta">ETA</div>
        </div>

        <div class="ph6-package" data-ph6-state="delivered">
          <div class="ph6-package-icon">✓</div>
          <div><strong>Printer accessories</strong><small>Delivered</small><div class="ph6-progress"><span style="width:100%"></span></div></div>
          <div class="ph6-meta">Delivered</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="ph6-section ph6-reveal">
  <div class="ph6-stats">
    <div class="ph6-stat"><strong>2</strong><span>tracking providers</span></div>
    <div class="ph6-stat"><strong>2</strong><span>languages</span></div>
    <div class="ph6-stat"><strong id="ph6-stars">—</strong><span>GitHub Stars</span></div>
    <div class="ph6-stat"><strong id="ph6-version">Latest</strong><span>release</span></div>
  </div>
</section>

<section class="ph6-section ph6-reveal">
  <div class="ph6-kicker">Why PaketHub</div>
  <h2 class="ph6-title">Every shipment. One consistent experience.</h2>
  <div class="ph6-feature-grid">
    <article class="ph6-card"><div class="ph6-card-icon">◎</div><h3>Smart provider selection</h3><p>PaketHub automatically chooses between native tracking and 17TRACK fallback.</p></article>
    <article class="ph6-card"><div class="ph6-card-icon">▦</div><h3>A dashboard, not data chaos</h3><p>Active, delayed and delivered shipments stay readable on every device.</p></article>
    <article class="ph6-card"><div class="ph6-card-icon">⌁</div><h3>Transparent diagnostics</h3><p>Provider usage, fallbacks and state changes stay understandable.</p></article>
    <article class="ph6-card"><div class="ph6-card-icon">◉</div><h3>Automation ready</h3><p>Use shipment states directly in notifications and Home Assistant automations.</p></article>
    <article class="ph6-card"><div class="ph6-card-icon">◇</div><h3>Privacy conscious</h3><p>Sensitive shipment data stays out of public diagnostics.</p></article>
    <article class="ph6-card"><div class="ph6-card-icon">＋</div><h3>Built for more carriers</h3><p>The provider framework can grow with additional native carrier services.</p></article>
  </div>
</section>

<section class="ph6-section ph6-reveal">
  <div class="ph6-split">
    <div>
      <div class="ph6-kicker">HACS</div>
      <h2 class="ph6-title">Installed in minutes</h2>
      <p>Add the repository, download PaketHub, restart Home Assistant and configure the integration.</p>
    </div>
    <div class="ph6-panel">
      <div class="ph6-code">https://github.com/eifeldj/pakethub<button class="ph6-copy-button" data-ph6-copy="https://github.com/eifeldj/pakethub" data-success="Copied">Copy</button></div>
      <p><a href="installation/">Open installation guide &rarr;</a></p>
    </div>
  </div>
</section>

<section class="ph6-section ph6-reveal">
  <div class="ph6-split">
    <div class="ph6-panel">
      <div class="ph6-kicker">Provider intelligence</div>
      <h2>Native when possible. Fallback when needed.</h2>
      <div class="ph6-provider-controls">
        <button class="ph6-provider-button is-active" data-ph6-provider="ups">UPS</button>
        <button class="ph6-provider-button" data-ph6-provider="unknown">Unknown</button>
        <button class="ph6-provider-button" data-ph6-provider="failure">Failure</button>
      </div>
      <div class="ph6-provider-result"><span data-ph6-provider-result>UPS native provider selected</span><span class="ph6-badge" data-ph6-provider-badge data-state="native">Native</span></div>
    </div>

    <div class="ph6-panel">
      <div class="ph6-kicker">Interactive tracking</div>
      <h2>Watch the shipment move.</h2>
      <div class="ph6-timeline">
        <div class="ph6-timeline-step"><div><strong>Registered</strong><br><small>17TRACK registry</small></div></div>
        <div class="ph6-timeline-step"><div><strong>Carrier detected</strong><br><small>Provider detection</small></div></div>
        <div class="ph6-timeline-step"><div><strong>In transit</strong><br><small>Normalized state</small></div></div>
        <div class="ph6-timeline-step"><div><strong>Delivered</strong><br><small>Entity update</small></div></div>
      </div>
      <button class="ph6-run" data-ph6-run>Run demo</button>
    </div>
  </div>
</section>

<section class="ph6-section ph6-reveal">
  <div class="ph6-kicker">Ecosystem</div>
  <h2 class="ph6-title">Providers today and tomorrow</h2>
  <div class="ph6-provider-grid">
    <div class="ph6-provider-card"><strong>17TRACK</strong><br><span>Registry and fallback</span><br><span class="ph6-state ready">Available</span></div>
    <div class="ph6-provider-card"><strong>UPS</strong><br><span>Native provider</span><br><span class="ph6-state ready">Available</span></div>
    <div class="ph6-provider-card"><strong>DHL</strong><br><span>Future provider</span><br><span class="ph6-state planned">Planned</span></div>
    <div class="ph6-provider-card"><strong>More carriers</strong><br><span>Provider framework</span><br><span class="ph6-state planned">Roadmap</span></div>
  </div>
</section>

<section class="ph6-section ph6-reveal">
  <div class="ph6-kicker">Architecture</div>
  <h2 class="ph6-title">A clear data flow</h2>
  <div class="ph6-architecture">
    <div class="ph6-node">Home Assistant</div>
    <div class="ph6-node">Coordinator</div>
    <div class="ph6-node">Detection</div>
    <div class="ph6-node">Native / Fallback</div>
    <div class="ph6-node">Entities</div>
  </div>
</section>

<section class="ph6-section ph6-cta ph6-reveal">
  <h2>Bring your packages home.</h2>
  <p>Install PaketHub and make parcel tracking a natural part of your Home Assistant dashboard.</p>
  <a class="ph6-btn primary" href="installation/">Install PaketHub</a>
</section>

<footer class="ph6-footer">
  <div class="ph6-footer-grid">
    <div><h3>PaketHub</h3><p>Intelligent parcel tracking for Home Assistant.</p></div>
    <div><h4>Docs</h4><a href="installation/">Installation</a><a href="configuration/">Configuration</a><a href="dashboard-card/">Dashboard</a></div>
    <div><h4>Project</h4><a href="roadmap/">Roadmap</a><a href="releases/">Releases</a><a href="development/">Development</a></div>
    <div><h4>Community</h4><a href="https://github.com/eifeldj/pakethub">GitHub</a><a href="https://github.com/eifeldj/pakethub/issues">Issues</a><a href="https://github.com/eifeldj/pakethub/security">Security</a></div>
  </div>
  <div class="ph6-footer-bottom"><span>© Volker Moeltgen</span><span>Open Source · Home Assistant</span></div>
</footer>

</div>
