---
hide:
  - navigation
  - toc
description: PaketHub brings intelligent parcel tracking to Home Assistant.
---

<div class="ph7-home">

<section class="ph7-hero">
  <div class="ph7-copy">
    <div class="ph7-eyebrow">◆ Built for Home Assistant</div>
    <h1>Smart parcel tracking.<br><span class="ph7-gradient">Native to Home Assistant.</span></h1>
    <p class="ph7-tagline">Native providers first. 17TRACK when needed.</p>
    <p class="ph7-lead">PaketHub automatically chooses the smartest tracking route, normalizes carrier data and makes every shipment visible, automatable and understandable in Home Assistant.</p>

    <div class="ph7-actions">
      <a class="ph7-btn primary" href="installation/">⬇ Install PaketHub</a>
      <a class="ph7-btn" href="quickstart/">▶ Explore documentation</a>
      <a class="ph7-btn" href="https://github.com/eifeldj/pakethub">◆ GitHub</a>
    </div>

    <div class="ph7-trust">
      <span>✓ Native-first tracking</span>
      <span>✓ Automatic fallback</span>
      <span>✓ Open Source</span>
    </div>
  </div>

  <div class="ph7-dashboard-wrap">
    <div class="ph7-float-card one">● Carrier automatically detected</div>
    <div class="ph7-float-card two">✓ Delivery state updated</div>

    <div class="ph7-dashboard" data-ph7-demo>
      <div class="ph7-dash-head">
        <div class="ph7-brand"><span class="ph7-brand-mark">▣</span><span>PaketHub</span></div>
        <span class="ph7-live">LIVE</span>
      </div>

      <div class="ph7-tabs">
        <button class="ph7-tab is-active" data-ph7-filter="all">All</button>
        <button class="ph7-tab" data-ph7-filter="active">Active</button>
        <button class="ph7-tab" data-ph7-filter="delivered">Delivered</button>
      </div>

      <div class="ph7-list">
        <div class="ph7-package" data-ph7-state="active">
          <div class="ph7-package-icon">↗</div>
          <div>
            <strong>Coffee order</strong>
            <small data-ph7-live-status>UPS · In transit · Vienna</small>
            <div class="ph7-progress"><span data-ph7-live-progress style="width:72%"></span></div>
          </div>
          <div class="ph7-meta" data-ph7-live-eta>Tomorrow</div>
        </div>

        <div class="ph7-package" data-ph7-state="active">
          <div class="ph7-package-icon">⌁</div>
          <div><strong>Home Assistant hardware</strong><small>17TRACK · Customs cleared</small><div class="ph7-progress"><span style="width:49%"></span></div></div>
          <div class="ph7-meta">ETA</div>
        </div>

        <div class="ph7-package" data-ph7-state="delivered">
          <div class="ph7-package-icon">✓</div>
          <div><strong>Printer accessories</strong><small>Delivered</small><div class="ph7-progress"><span style="width:100%"></span></div></div>
          <div class="ph7-meta">Delivered</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="ph7-section ph7-reveal">
  <div class="ph7-stats">
    <div class="ph7-stat"><strong>2</strong><span>tracking providers</span></div>
    <div class="ph7-stat"><strong id="ph7-stars">—</strong><span>GitHub Stars</span></div>
    <div class="ph7-stat"><strong id="ph7-forks">—</strong><span>Forks</span></div>
    <div class="ph7-stat"><strong id="ph7-issues">—</strong><span>Open Issues</span></div>
    <div class="ph7-stat"><strong id="ph7-version">Latest</strong><span>release</span></div>
  </div>
</section>

<section class="ph7-section ph7-reveal">
  <div class="ph7-kicker">Why PaketHub</div>
  <h2 class="ph7-title">Every shipment. One consistent experience.</h2>

  <div class="ph7-feature-grid">
    <article class="ph7-card"><div class="ph7-card-icon">◎</div><h3>Smart provider selection</h3><p>PaketHub automatically chooses between native tracking and 17TRACK fallback.</p></article>
    <article class="ph7-card"><div class="ph7-card-icon">▦</div><h3>A dashboard, not data chaos</h3><p>Active, delayed and delivered shipments stay readable on every device.</p></article>
    <article class="ph7-card"><div class="ph7-card-icon">⌁</div><h3>Transparent diagnostics</h3><p>Provider usage, fallbacks and state changes stay understandable.</p></article>
  </div>
</section>

<section class="ph7-section ph7-reveal">
  <div class="ph7-story">
    <div>
      <div class="ph7-kicker">From tracking code to entity</div>
      <h2 class="ph7-title">PaketHub tells the whole story.</h2>
      <p>Instead of isolated carrier responses, you get one clear normalized flow for dashboards, automations and diagnostics.</p>
    </div>

    <div class="ph7-story-visual">
      <div class="ph7-story-line"></div>
      <div class="ph7-story-node"><strong>1. Register shipment</strong><br><small>17TRACK registry</small></div>
      <div class="ph7-story-node"><strong>2. Detect carrier</strong><br><small>Provider manager</small></div>
      <div class="ph7-story-node"><strong>3. Native or fallback</strong><br><small>UPS / 17TRACK</small></div>
      <div class="ph7-story-node"><strong>4. Normalize status</strong><br><small>Home Assistant entities</small></div>
    </div>
  </div>
</section>

<section class="ph7-section ph7-reveal">
  <div class="ph7-split">
    <div>
      <div class="ph7-kicker">HACS</div>
      <h2 class="ph7-title">Installed in minutes</h2>
      <p>Add the repository, download PaketHub, restart Home Assistant and configure the integration.</p>
    </div>

    <div class="ph7-panel">
      <div class="ph7-code">https://github.com/eifeldj/pakethub<button class="ph7-copy-button" data-ph7-copy="https://github.com/eifeldj/pakethub" data-success="Copied">Copy</button></div>
      <p><a href="installation/">Open installation guide &rarr;</a></p>
    </div>
  </div>
</section>

<section class="ph7-section ph7-reveal">
  <div class="ph7-split">
    <div class="ph7-panel">
      <div class="ph7-kicker">Provider intelligence</div>
      <h2>Native when possible. Fallback when needed.</h2>
      <div class="ph7-provider-controls">
        <button class="ph7-provider-button is-active" data-ph7-provider="ups">UPS</button>
        <button class="ph7-provider-button" data-ph7-provider="unknown">Unknown</button>
        <button class="ph7-provider-button" data-ph7-provider="failure">Failure</button>
      </div>
      <div class="ph7-provider-result"><span data-ph7-provider-result>UPS native provider selected</span><span class="ph7-badge" data-ph7-provider-badge data-state="native">Native</span></div>
    </div>

    <div class="ph7-panel">
      <div class="ph7-kicker">Interactive tracking</div>
      <h2>Watch the shipment move.</h2>
      <div class="ph7-timeline">
        <div class="ph7-timeline-step"><div><strong>Registered</strong><br><small>17TRACK registry</small></div></div>
        <div class="ph7-timeline-step"><div><strong>Carrier detected</strong><br><small>Provider detection</small></div></div>
        <div class="ph7-timeline-step"><div><strong>In transit</strong><br><small>Normalized state</small></div></div>
        <div class="ph7-timeline-step"><div><strong>Delivered</strong><br><small>Entity update</small></div></div>
      </div>
      <button class="ph7-run" data-ph7-run>Run demo</button>
    </div>
  </div>
</section>

<section class="ph7-section ph7-reveal">
  <div class="ph7-kicker">Ecosystem</div>
  <h2 class="ph7-title">Providers today and tomorrow</h2>
  <div class="ph7-provider-grid">
    <div class="ph7-provider-card"><strong>17TRACK</strong><br><span>Registry and fallback</span><br><span class="ph7-state ready">Available</span></div>
    <div class="ph7-provider-card"><strong>UPS</strong><br><span>Native provider</span><br><span class="ph7-state ready">Available</span></div>
    <div class="ph7-provider-card"><strong>DHL</strong><br><span>Future provider</span><br><span class="ph7-state planned">Planned</span></div>
    <div class="ph7-provider-card"><strong>More carriers</strong><br><span>Provider framework</span><br><span class="ph7-state planned">Roadmap</span></div>
  </div>
</section>

<section class="ph7-section ph7-reveal">
  <div class="ph7-kicker">Architecture</div>
  <h2 class="ph7-title">A clear data flow</h2>
  <div class="ph7-architecture">
    <div class="ph7-node">Home Assistant</div>
    <div class="ph7-node">Coordinator</div>
    <div class="ph7-node">Detection</div>
    <div class="ph7-node">Native / Fallback</div>
    <div class="ph7-node">Entities</div>
  </div>
</section>

<section class="ph7-section ph7-cta ph7-reveal">
  <h2>Bring your packages home.</h2>
  <p>Install PaketHub and make parcel tracking a natural part of your Home Assistant dashboard.</p>
  <a class="ph7-btn primary" href="installation/">Install PaketHub</a>
</section>

<footer class="ph7-footer">
  <div class="ph7-footer-grid">
    <div><h3>PaketHub</h3><p>Intelligent parcel tracking for Home Assistant.</p></div>
    <div><h4>Docs</h4><a href="installation/">Installation</a><a href="configuration/">Configuration</a><a href="dashboard-card/">Dashboard</a></div>
    <div><h4>Project</h4><a href="roadmap/">Roadmap</a><a href="releases/">Releases</a><a href="development/">Development</a></div>
    <div><h4>Community</h4><a href="https://github.com/eifeldj/pakethub">GitHub</a><a href="https://github.com/eifeldj/pakethub/issues">Issues</a><a href="https://github.com/eifeldj/pakethub/security">Security</a></div>
  </div>
  <div class="ph7-footer-bottom"><span>© Volker Moeltgen</span><span>Open Source · Home Assistant</span></div>
</footer>

</div>
