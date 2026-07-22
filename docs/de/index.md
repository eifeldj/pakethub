---
hide:
  - navigation
  - toc
description: PaketHub bringt intelligente Paketverfolgung in Home Assistant.
---

<div class="ph7-home">

<section class="ph7-hero">
  <div class="ph7-copy">
    <div class="ph7-eyebrow">◆ Für Home Assistant entwickelt</div>
    <h1>Smartes Paket-Tracking.<br><span class="ph7-gradient">Direkt in Home Assistant.</span></h1>
    <p class="ph7-tagline">Native Provider zuerst. 17TRACK, wenn nötig.</p>
    <p class="ph7-lead">PaketHub wählt automatisch den besten Trackingweg, normalisiert Carrier-Daten und macht deine Sendungen in Home Assistant sichtbar, automatisierbar und verständlich.</p>

    <div class="ph7-actions">
      <a class="ph7-btn primary" href="installation/">⬇ PaketHub installieren</a>
      <a class="ph7-btn" href="quickstart/">▶ Dokumentation entdecken</a>
      <a class="ph7-btn" href="https://github.com/eifeldj/pakethub">◆ GitHub</a>
    </div>

    <div class="ph7-trust">
      <span>✓ Native Provider zuerst</span>
      <span>✓ Automatischer Fallback</span>
      <span>✓ Open Source</span>
    </div>
  </div>

  <div class="ph7-dashboard-wrap">
    <div class="ph7-float-card one">● Carrier automatisch erkannt</div>
    <div class="ph7-float-card two">✓ Zustellung aktualisiert</div>

    <div class="ph7-dashboard" data-ph7-demo>
      <div class="ph7-dash-head">
        <div class="ph7-brand"><span class="ph7-brand-mark">▣</span><span>PaketHub</span></div>
        <span class="ph7-live">LIVE</span>
      </div>

      <div class="ph7-tabs">
        <button class="ph7-tab is-active" data-ph7-filter="all">Alle</button>
        <button class="ph7-tab" data-ph7-filter="active">Aktiv</button>
        <button class="ph7-tab" data-ph7-filter="delivered">Zugestellt</button>
      </div>

      <div class="ph7-list">
        <div class="ph7-package" data-ph7-state="active">
          <div class="ph7-package-icon">↗</div>
          <div>
            <strong>Kaffeebestellung</strong>
            <small data-ph7-live-status>UPS · Unterwegs · Wien</small>
            <div class="ph7-progress"><span data-ph7-live-progress style="width:72%"></span></div>
          </div>
          <div class="ph7-meta" data-ph7-live-eta>Morgen</div>
        </div>

        <div class="ph7-package" data-ph7-state="active">
          <div class="ph7-package-icon">⌁</div>
          <div><strong>Home-Assistant-Hardware</strong><small>17TRACK · Zoll abgeschlossen</small><div class="ph7-progress"><span style="width:49%"></span></div></div>
          <div class="ph7-meta">ETA</div>
        </div>

        <div class="ph7-package" data-ph7-state="delivered">
          <div class="ph7-package-icon">✓</div>
          <div><strong>Druckerzubehör</strong><small>Zugestellt</small><div class="ph7-progress"><span style="width:100%"></span></div></div>
          <div class="ph7-meta">Zugestellt</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="ph7-section ph7-reveal">
  <div class="ph7-stats">
    <div class="ph7-stat"><strong>2</strong><span>Tracking-Provider</span></div>
    <div class="ph7-stat"><strong id="ph7-stars">—</strong><span>GitHub Stars</span></div>
    <div class="ph7-stat"><strong id="ph7-forks">—</strong><span>Forks</span></div>
    <div class="ph7-stat"><strong id="ph7-issues">—</strong><span>Open Issues</span></div>
    <div class="ph7-stat"><strong id="ph7-version">Latest</strong><span>Version</span></div>
  </div>
</section>

<section class="ph7-section ph7-reveal">
  <div class="ph7-kicker">Warum PaketHub?</div>
  <h2 class="ph7-title">Jede Sendung. Ein einheitliches Erlebnis.</h2>

  <div class="ph7-feature-grid">
    <article class="ph7-card"><div class="ph7-card-icon">◎</div><h3>Intelligente Provider-Auswahl</h3><p>PaketHub entscheidet automatisch zwischen nativem Tracking und 17TRACK-Fallback.</p></article>
    <article class="ph7-card"><div class="ph7-card-icon">▦</div><h3>Dashboard statt Datenchaos</h3><p>Aktive, verspätete und zugestellte Sendungen bleiben auf jedem Gerät verständlich.</p></article>
    <article class="ph7-card"><div class="ph7-card-icon">⌁</div><h3>Transparente Diagnose</h3><p>Provider-Nutzung, Fallbacks und Statuswechsel bleiben nachvollziehbar.</p></article>
  </div>
</section>

<section class="ph7-section ph7-reveal">
  <div class="ph7-story">
    <div>
      <div class="ph7-kicker">Vom Trackingcode zur Entität</div>
      <h2 class="ph7-title">PaketHub erzählt den ganzen Weg.</h2>
      <p>Statt einzelner Carrier-Antworten bekommst du einen klaren, normalisierten Datenfluss für Dashboard, Automationen und Diagnose.</p>
    </div>

    <div class="ph7-story-visual">
      <div class="ph7-story-line"></div>
      <div class="ph7-story-node"><strong>1. Sendung registrieren</strong><br><small>17TRACK registry</small></div>
      <div class="ph7-story-node"><strong>2. Carrier erkennen</strong><br><small>Provider manager</small></div>
      <div class="ph7-story-node"><strong>3. Nativ oder Fallback</strong><br><small>UPS / 17TRACK</small></div>
      <div class="ph7-story-node"><strong>4. Status normalisieren</strong><br><small>Home Assistant entities</small></div>
    </div>
  </div>
</section>

<section class="ph7-section ph7-reveal">
  <div class="ph7-split">
    <div>
      <div class="ph7-kicker">HACS</div>
      <h2 class="ph7-title">In wenigen Minuten installiert</h2>
      <p>Repository hinzufügen, PaketHub herunterladen, Home Assistant neu starten und die Integration einrichten.</p>
    </div>

    <div class="ph7-panel">
      <div class="ph7-code">https://github.com/eifeldj/pakethub<button class="ph7-copy-button" data-ph7-copy="https://github.com/eifeldj/pakethub" data-success="Kopiert">Kopieren</button></div>
      <p><a href="installation/">Installationsanleitung öffnen &rarr;</a></p>
    </div>
  </div>
</section>

<section class="ph7-section ph7-reveal">
  <div class="ph7-split">
    <div class="ph7-panel">
      <div class="ph7-kicker">Provider intelligence</div>
      <h2>Nativ, wenn möglich. Fallback, wenn nötig.</h2>
      <div class="ph7-provider-controls">
        <button class="ph7-provider-button is-active" data-ph7-provider="ups">UPS</button>
        <button class="ph7-provider-button" data-ph7-provider="unknown">Unknown</button>
        <button class="ph7-provider-button" data-ph7-provider="failure">Failure</button>
      </div>
      <div class="ph7-provider-result"><span data-ph7-provider-result>UPS native provider selected</span><span class="ph7-badge" data-ph7-provider-badge data-state="native">Native</span></div>
    </div>

    <div class="ph7-panel">
      <div class="ph7-kicker">Interactive tracking</div>
      <h2>Erlebe den Paketfluss.</h2>
      <div class="ph7-timeline">
        <div class="ph7-timeline-step"><div><strong>Registriert</strong><br><small>17TRACK registry</small></div></div>
        <div class="ph7-timeline-step"><div><strong>Carrier erkannt</strong><br><small>Provider detection</small></div></div>
        <div class="ph7-timeline-step"><div><strong>Unterwegs</strong><br><small>Normalized state</small></div></div>
        <div class="ph7-timeline-step"><div><strong>Zugestellt</strong><br><small>Entity update</small></div></div>
      </div>
      <button class="ph7-run" data-ph7-run>Demo starten</button>
    </div>
  </div>
</section>

<section class="ph7-section ph7-reveal">
  <div class="ph7-kicker">Ecosystem</div>
  <h2 class="ph7-title">Provider heute und morgen</h2>
  <div class="ph7-provider-grid">
    <div class="ph7-provider-card"><strong>17TRACK</strong><br><span>Registrierung und Fallback</span><br><span class="ph7-state ready">Available</span></div>
    <div class="ph7-provider-card"><strong>UPS</strong><br><span>Nativer Provider</span><br><span class="ph7-state ready">Available</span></div>
    <div class="ph7-provider-card"><strong>DHL</strong><br><span>Zukünftiger Provider</span><br><span class="ph7-state planned">Planned</span></div>
    <div class="ph7-provider-card"><strong>Weitere Carrier</strong><br><span>Provider framework</span><br><span class="ph7-state planned">Roadmap</span></div>
  </div>
</section>

<section class="ph7-section ph7-reveal">
  <div class="ph7-kicker">Architecture</div>
  <h2 class="ph7-title">Ein klarer Datenfluss</h2>
  <div class="ph7-architecture">
    <div class="ph7-node">Home Assistant</div>
    <div class="ph7-node">Coordinator</div>
    <div class="ph7-node">Detection</div>
    <div class="ph7-node">Native / Fallback</div>
    <div class="ph7-node">Entities</div>
  </div>
</section>

<section class="ph7-section ph7-cta ph7-reveal">
  <h2>Hol deine Pakete nach Hause.</h2>
  <p>Installiere PaketHub und mache Paketverfolgung zu einem natürlichen Teil deines Home-Assistant-Dashboards.</p>
  <a class="ph7-btn primary" href="installation/">PaketHub installieren</a>
</section>

<footer class="ph7-footer">
  <div class="ph7-footer-grid">
    <div><h3>PaketHub</h3><p>Intelligente Paketverfolgung für Home Assistant.</p></div>
    <div><h4>Docs</h4><a href="installation/">Installation</a><a href="configuration/">Configuration</a><a href="dashboard-card/">Dashboard</a></div>
    <div><h4>Project</h4><a href="roadmap/">Roadmap</a><a href="releases/">Releases</a><a href="development/">Development</a></div>
    <div><h4>Community</h4><a href="https://github.com/eifeldj/pakethub">GitHub</a><a href="https://github.com/eifeldj/pakethub/issues">Issues</a><a href="https://github.com/eifeldj/pakethub/security">Security</a></div>
  </div>
  <div class="ph7-footer-bottom"><span>© Volker Moeltgen</span><span>Open Source · Home Assistant</span></div>
</footer>

</div>
