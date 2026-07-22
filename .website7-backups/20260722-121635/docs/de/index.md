---
hide:
  - navigation
  - toc
description: PaketHub bringt intelligente Paketverfolgung in Home Assistant.
---

<div class="ph6-home">

<section class="ph6-hero">
  <div class="ph6-copy">
    <div class="ph6-eyebrow">◆ Für Home Assistant entwickelt</div>
    <h1>Smartes Paket-Tracking.<br><span class="ph6-gradient">Direkt in Home Assistant.</span></h1>
    <p class="ph6-tagline">Native Provider zuerst. 17TRACK, wenn nötig.</p>
    <p class="ph6-lead">PaketHub wählt automatisch den besten Trackingweg, normalisiert Carrier-Daten und macht deine Sendungen in Home Assistant sichtbar, automatisierbar und verständlich.</p>
    <div class="ph6-actions">
      <a class="ph6-btn primary" href="installation/">⬇ PaketHub installieren</a>
      <a class="ph6-btn" href="quickstart/">▶ Dokumentation entdecken</a>
      <a class="ph6-btn" href="https://github.com/eifeldj/pakethub">◆ GitHub</a>
    </div>
    <div class="ph6-trust">
      <span>✓ Native Provider zuerst</span>
      <span>✓ Automatischer Fallback</span>
      <span>✓ Open Source</span>
    </div>
  </div>

  <div class="ph6-dashboard-wrap">
    <div class="ph6-float-card one">● Carrier automatisch erkannt</div>
    <div class="ph6-float-card two">✓ Zustellung aktualisiert</div>

    <div class="ph6-dashboard" data-ph6-demo>
      <div class="ph6-dash-head">
        <div class="ph6-brand"><span class="ph6-brand-mark">▣</span><span>PaketHub</span></div>
        <span class="ph6-live">LIVE</span>
      </div>

      <div class="ph6-tabs">
        <button class="ph6-tab is-active" data-ph6-filter="all">Alle</button>
        <button class="ph6-tab" data-ph6-filter="active">Aktiv</button>
        <button class="ph6-tab" data-ph6-filter="delivered">Zugestellt</button>
      </div>

      <div class="ph6-list">
        <div class="ph6-package" data-ph6-state="active">
          <div class="ph6-package-icon">↗</div>
          <div><strong>Kaffeebestellung</strong><small>UPS · Unterwegs · Wien</small><div class="ph6-progress"><span style="width:72%"></span></div></div>
          <div class="ph6-meta">Morgen</div>
        </div>

        <div class="ph6-package" data-ph6-state="active">
          <div class="ph6-package-icon">⌁</div>
          <div><strong>Home-Assistant-Hardware</strong><small>17TRACK · Zoll abgeschlossen</small><div class="ph6-progress"><span style="width:49%"></span></div></div>
          <div class="ph6-meta">ETA</div>
        </div>

        <div class="ph6-package" data-ph6-state="delivered">
          <div class="ph6-package-icon">✓</div>
          <div><strong>Druckerzubehör</strong><small>Zugestellt</small><div class="ph6-progress"><span style="width:100%"></span></div></div>
          <div class="ph6-meta">Zugestellt</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="ph6-section ph6-reveal">
  <div class="ph6-stats">
    <div class="ph6-stat"><strong>2</strong><span>Tracking-Provider</span></div>
    <div class="ph6-stat"><strong>2</strong><span>Sprachen</span></div>
    <div class="ph6-stat"><strong id="ph6-stars">—</strong><span>GitHub Stars</span></div>
    <div class="ph6-stat"><strong id="ph6-version">Latest</strong><span>Version</span></div>
  </div>
</section>

<section class="ph6-section ph6-reveal">
  <div class="ph6-kicker">Warum PaketHub?</div>
  <h2 class="ph6-title">Jede Sendung. Ein einheitliches Erlebnis.</h2>
  <div class="ph6-feature-grid">
    <article class="ph6-card"><div class="ph6-card-icon">◎</div><h3>Intelligente Provider-Auswahl</h3><p>PaketHub entscheidet automatisch zwischen nativem Tracking und 17TRACK-Fallback.</p></article>
    <article class="ph6-card"><div class="ph6-card-icon">▦</div><h3>Dashboard statt Datenchaos</h3><p>Aktive, verspätete und zugestellte Sendungen bleiben auf jedem Gerät verständlich.</p></article>
    <article class="ph6-card"><div class="ph6-card-icon">⌁</div><h3>Transparente Diagnose</h3><p>Provider-Nutzung, Fallbacks und Statuswechsel bleiben nachvollziehbar.</p></article>
    <article class="ph6-card"><div class="ph6-card-icon">◉</div><h3>Automationsbereit</h3><p>Sendungsstatus direkt in Benachrichtigungen und Home-Assistant-Automationen verwenden.</p></article>
    <article class="ph6-card"><div class="ph6-card-icon">◇</div><h3>Datenschutzbewusst</h3><p>Sensible Trackingdaten bleiben aus öffentlichen Diagnosen heraus.</p></article>
    <article class="ph6-card"><div class="ph6-card-icon">＋</div><h3>Für neue Carrier gebaut</h3><p>Das Provider-Framework lässt sich schrittweise um weitere native Dienste erweitern.</p></article>
  </div>
</section>

<section class="ph6-section ph6-reveal">
  <div class="ph6-split">
    <div>
      <div class="ph6-kicker">HACS</div>
      <h2 class="ph6-title">In wenigen Minuten installiert</h2>
      <p>Repository hinzufügen, PaketHub herunterladen, Home Assistant neu starten und die Integration einrichten.</p>
    </div>
    <div class="ph6-panel">
      <div class="ph6-code">https://github.com/eifeldj/pakethub<button class="ph6-copy-button" data-ph6-copy="https://github.com/eifeldj/pakethub" data-success="Kopiert">Kopieren</button></div>
      <p><a href="installation/">Installationsanleitung öffnen &rarr;</a></p>
    </div>
  </div>
</section>

<section class="ph6-section ph6-reveal">
  <div class="ph6-split">
    <div class="ph6-panel">
      <div class="ph6-kicker">Provider intelligence</div>
      <h2>Nativ, wenn möglich. Fallback, wenn nötig.</h2>
      <div class="ph6-provider-controls">
        <button class="ph6-provider-button is-active" data-ph6-provider="ups">UPS</button>
        <button class="ph6-provider-button" data-ph6-provider="unknown">Unknown</button>
        <button class="ph6-provider-button" data-ph6-provider="failure">Failure</button>
      </div>
      <div class="ph6-provider-result"><span data-ph6-provider-result>UPS native provider selected</span><span class="ph6-badge" data-ph6-provider-badge data-state="native">Native</span></div>
    </div>

    <div class="ph6-panel">
      <div class="ph6-kicker">Interactive tracking</div>
      <h2>Erlebe den Paketfluss.</h2>
      <div class="ph6-timeline">
        <div class="ph6-timeline-step"><div><strong>Registriert</strong><br><small>17TRACK registry</small></div></div>
        <div class="ph6-timeline-step"><div><strong>Carrier erkannt</strong><br><small>Provider detection</small></div></div>
        <div class="ph6-timeline-step"><div><strong>Unterwegs</strong><br><small>Normalized state</small></div></div>
        <div class="ph6-timeline-step"><div><strong>Zugestellt</strong><br><small>Entity update</small></div></div>
      </div>
      <button class="ph6-run" data-ph6-run>Demo starten</button>
    </div>
  </div>
</section>

<section class="ph6-section ph6-reveal">
  <div class="ph6-kicker">Ecosystem</div>
  <h2 class="ph6-title">Provider heute und morgen</h2>
  <div class="ph6-provider-grid">
    <div class="ph6-provider-card"><strong>17TRACK</strong><br><span>Registrierung und Fallback</span><br><span class="ph6-state ready">Available</span></div>
    <div class="ph6-provider-card"><strong>UPS</strong><br><span>Nativer Provider</span><br><span class="ph6-state ready">Available</span></div>
    <div class="ph6-provider-card"><strong>DHL</strong><br><span>Zukünftiger Provider</span><br><span class="ph6-state planned">Planned</span></div>
    <div class="ph6-provider-card"><strong>Weitere Carrier</strong><br><span>Provider framework</span><br><span class="ph6-state planned">Roadmap</span></div>
  </div>
</section>

<section class="ph6-section ph6-reveal">
  <div class="ph6-kicker">Architecture</div>
  <h2 class="ph6-title">Ein klarer Datenfluss</h2>
  <div class="ph6-architecture">
    <div class="ph6-node">Home Assistant</div>
    <div class="ph6-node">Coordinator</div>
    <div class="ph6-node">Detection</div>
    <div class="ph6-node">Native / Fallback</div>
    <div class="ph6-node">Entities</div>
  </div>
</section>

<section class="ph6-section ph6-cta ph6-reveal">
  <h2>Hol deine Pakete nach Hause.</h2>
  <p>Installiere PaketHub und mache Paketverfolgung zu einem natürlichen Teil deines Home-Assistant-Dashboards.</p>
  <a class="ph6-btn primary" href="installation/">PaketHub installieren</a>
</section>

<footer class="ph6-footer">
  <div class="ph6-footer-grid">
    <div><h3>PaketHub</h3><p>Intelligente Paketverfolgung für Home Assistant.</p></div>
    <div><h4>Docs</h4><a href="installation/">Installation</a><a href="configuration/">Configuration</a><a href="dashboard-card/">Dashboard</a></div>
    <div><h4>Project</h4><a href="roadmap/">Roadmap</a><a href="releases/">Releases</a><a href="development/">Development</a></div>
    <div><h4>Community</h4><a href="https://github.com/eifeldj/pakethub">GitHub</a><a href="https://github.com/eifeldj/pakethub/issues">Issues</a><a href="https://github.com/eifeldj/pakethub/security">Security</a></div>
  </div>
  <div class="ph6-footer-bottom"><span>© Volker Moeltgen</span><span>Open Source · Home Assistant</span></div>
</footer>

</div>
