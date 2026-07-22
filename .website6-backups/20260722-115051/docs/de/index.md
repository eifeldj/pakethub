---
hide:
  - navigation
  - toc
description: PaketHub bringt intelligente Paketverfolgung in Home Assistant.
---

<div class="ph5-home">

<section class="ph5-hero">
  <div class="ph5-copy">
    <div class="ph5-eyebrow">Für Home Assistant entwickelt</div>
    <h1>Paketverfolgung,<br><span class="ph5-gradient">endlich zu Hause.</span></h1>
    <p class="ph5-lead">PaketHub vereint 17TRACK, native Provider, automatischen Fallback, Diagnose und ein eigenes Dashboard-Erlebnis in einer Integration.</p>
    <div class="ph5-actions">
      <a class="ph5-btn primary" href="installation/">PaketHub installieren</a>
      <a class="ph5-btn" href="quickstart/">Dokumentation entdecken</a>
      <a class="ph5-btn" href="https://github.com/eifeldj/pakethub">GitHub</a>
    </div>
    <div class="ph5-trust">
      <span>✓ Native Provider zuerst</span>
      <span>✓ Automatischer Fallback</span>
      <span>✓ Open Source</span>
    </div>
  </div>

  <div class="ph5-dashboard" data-demo>
    <div class="ph5-dash-head"><span>📦 PaketHub</span><span class="ph5-live">LIVE</span></div>
    <div class="ph5-tabs">
      <button class="ph5-tab active" data-filter="all">Alle</button>
      <button class="ph5-tab" data-filter="active">Aktiv</button>
      <button class="ph5-tab" data-filter="delivered">Zugestellt</button>
    </div>
    <div class="ph5-list">
      <div class="ph5-package" data-state="active"><div class="ph5-icon">↗</div><div><strong>Kaffeebestellung</strong><small>UPS · Unterwegs · Wien</small><div class="ph5-progress"><span style="width:72%"></span></div></div><div class="ph5-meta">Morgen</div></div>
      <div class="ph5-package" data-state="active"><div class="ph5-icon">⌁</div><div><strong>Home-Assistant-Hardware</strong><small>17TRACK · Zoll abgeschlossen</small><div class="ph5-progress"><span style="width:49%"></span></div></div><div class="ph5-meta">ETA</div></div>
      <div class="ph5-package" data-state="delivered"><div class="ph5-icon">✓</div><div><strong>Druckerzubehör</strong><small>Zugestellt</small><div class="ph5-progress"><span style="width:100%"></span></div></div><div class="ph5-meta">Zugestellt</div></div>
    </div>
  </div>
</section>

<section class="ph5-section ph5-reveal">
  <div class="ph5-stats">
    <div class="ph5-stat"><strong>2</strong><span>Tracking-Provider</span></div>
    <div class="ph5-stat"><strong>2</strong><span>Sprachen</span></div>
    <div class="ph5-stat"><strong id="ph5-stars">—</strong><span>GitHub Stars</span></div>
    <div class="ph5-stat"><strong id="ph5-version">Latest</strong><span>Version</span></div>
  </div>
</section>

<section class="ph5-section ph5-reveal">
  <div class="ph5-kicker">Warum PaketHub?</div>
  <h2 class="ph5-title">Jede Sendung. Ein einheitliches Erlebnis.</h2>
  <div class="ph5-grid">
    <article class="ph5-card"><div class="ph5-card-icon">◎</div><h3>Intelligente Provider-Auswahl</h3><p>Automatische Entscheidung zwischen nativem Tracking und Fallback.</p></article>
    <article class="ph5-card"><div class="ph5-card-icon">▦</div><h3>Eigenes Dashboard</h3><p>Aktive, verspätete und zugestellte Sendungen bleiben übersichtlich.</p></article>
    <article class="ph5-card"><div class="ph5-card-icon">⌁</div><h3>Transparente Diagnose</h3><p>Provider-Nutzung und Fallbacks werden nachvollziehbar.</p></article>
    <article class="ph5-card"><div class="ph5-card-icon">◉</div><h3>Automationsbereit</h3><p>Statusänderungen direkt in Home Assistant verwenden.</p></article>
    <article class="ph5-card"><div class="ph5-card-icon">◇</div><h3>Datenschutzbewusst</h3><p>Sensible Informationen gehören nicht in öffentliche Diagnosen.</p></article>
    <article class="ph5-card"><div class="ph5-card-icon">＋</div><h3>Erweiterbar</h3><p>Weitere native Carrier können ergänzt werden.</p></article>
  </div>
</section>

<section class="ph5-section ph5-reveal">
  <div class="ph5-split">
    <div><div class="ph5-kicker">HACS</div><h2 class="ph5-title">In wenigen Minuten installiert</h2><p>Repository hinzufügen, PaketHub herunterladen und Home Assistant neu starten.</p></div>
    <div class="ph5-panel"><div class="ph5-code">https://github.com/eifeldj/pakethub<button class="ph5-copy-btn" data-copy="https://github.com/eifeldj/pakethub" data-success="Kopiert">Kopieren</button></div><p><a href="installation/">Installationsanleitung öffnen &rarr;</a></p></div>
  </div>
</section>

<section class="ph5-section ph5-reveal">
  <div class="ph5-split">
    <div class="ph5-panel">
      <div class="ph5-kicker">Provider intelligence</div>
      <h2>Nativ, wenn möglich. Fallback, wenn nötig.</h2>
      <div class="ph5-provider-controls"><button class="ph5-provider-btn active" data-provider="ups">UPS</button><button class="ph5-provider-btn" data-provider="unknown">Unknown</button><button class="ph5-provider-btn" data-provider="fail">Failure</button></div>
      <div class="ph5-provider-result"><span data-provider-result>UPS native provider selected</span><span class="ph5-badge" data-provider-badge data-state="native">Native</span></div>
    </div>
    <div class="ph5-panel">
      <div class="ph5-kicker">Interactive tracking</div>
      <h2>Erlebe den Paketfluss.</h2>
      <div class="ph5-timeline">
        <div class="ph5-step"><div><strong>Registriert</strong><br><small>17TRACK registry</small></div></div>
        <div class="ph5-step"><div><strong>Carrier erkannt</strong><br><small>Provider detection</small></div></div>
        <div class="ph5-step"><div><strong>Unterwegs</strong><br><small>Normalized state</small></div></div>
        <div class="ph5-step"><div><strong>Zugestellt</strong><br><small>Entity update</small></div></div>
      </div>
      <button class="ph5-run" data-run>Demo starten</button>
    </div>
  </div>
</section>

<section class="ph5-section ph5-reveal">
  <div class="ph5-kicker">Ecosystem</div>
  <h2 class="ph5-title">Provider heute und morgen</h2>
  <div class="ph5-providers">
    <div class="ph5-provider-card"><strong>17TRACK</strong><br><span>Registrierung und Fallback</span><br><span class="ph5-state ready">Available</span></div>
    <div class="ph5-provider-card"><strong>UPS</strong><br><span>Nativer Provider</span><br><span class="ph5-state ready">Available</span></div>
    <div class="ph5-provider-card"><strong>DHL</strong><br><span>Zukünftiger Provider</span><br><span class="ph5-state planned">Planned</span></div>
    <div class="ph5-provider-card"><strong>Weitere Carrier</strong><br><span>Provider framework</span><br><span class="ph5-state planned">Roadmap</span></div>
  </div>
</section>

<section class="ph5-section ph5-reveal">
  <div class="ph5-kicker">Architecture</div>
  <h2 class="ph5-title">Ein klarer Datenfluss</h2>
  <div class="ph5-architecture">
    <div class="ph5-node">Home Assistant</div>
    <div class="ph5-node">Coordinator</div>
    <div class="ph5-node">Detection</div>
    <div class="ph5-node">Native / Fallback</div>
    <div class="ph5-node">Entities</div>
  </div>
</section>

<section class="ph5-section ph5-cta ph5-reveal">
  <h2>Hol deine Pakete nach Hause.</h2>
  <p>Installiere PaketHub und integriere Paketverfolgung direkt in dein Home-Assistant-Dashboard.</p>
  <a class="ph5-btn primary" href="installation/">PaketHub installieren</a>
</section>

<footer class="ph5-footer">
  <div class="ph5-footer-grid">
    <div><h3>PaketHub</h3><p>Paketverfolgung für Home Assistant.</p></div>
    <div><h4>Docs</h4><a href="installation/">Installation</a><a href="configuration/">Configuration</a><a href="dashboard-card/">Dashboard</a></div>
    <div><h4>Project</h4><a href="roadmap/">Roadmap</a><a href="releases/">Releases</a><a href="development/">Development</a></div>
    <div><h4>Community</h4><a href="https://github.com/eifeldj/pakethub">GitHub</a><a href="https://github.com/eifeldj/pakethub/issues">Issues</a><a href="https://github.com/eifeldj/pakethub/security">Security</a></div>
  </div>
  <div class="ph5-footer-bottom"><span>© Volker Moeltgen</span><span>Open Source · Home Assistant</span></div>
</footer>

</div>
