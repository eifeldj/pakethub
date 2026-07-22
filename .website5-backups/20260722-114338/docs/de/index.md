---
hide:
  - navigation
  - toc
description: PaketHub bringt intelligente Paketverfolgung in Home Assistant.
---

<div class="ph4-home">
<section class="ph4-hero">
<div markdown>
<span class="ph4-eyebrow">:material-home-assistant: Für Home Assistant entwickelt</span>

# Paketverfolgung, <span class="ph4-gradient-text">endlich zu Hause.</span>

<div class="ph4-hero-lead">PaketHub vereint 17TRACK, native Provider, automatischen Fallback, Diagnose und ein eigenes Dashboard-Erlebnis in einer Integration.</div>

<div class="ph4-actions">
[PaketHub installieren](installation.md){ .md-button .md-button--primary }
[Dokumentation entdecken](quickstart.md){ .md-button }
[GitHub](https://github.com/eifeldj/pakethub){ .md-button }
</div>

<div class="ph4-trust"><span>✓ Native Provider zuerst</span><span>✓ Automatischer Fallback</span><span>✓ Open Source</span></div>
</div>

<div class="ph4-dashboard" data-demo-root>
<div class="ph4-dashboard-head"><div class="ph4-dashboard-title">📦 PaketHub</div><div class="ph4-live">LIVE</div></div>
<div class="ph4-demo-tabs"><button class="ph4-demo-tab is-active" data-demo-filter="all">Alle</button><button class="ph4-demo-tab" data-demo-filter="active">Aktiv</button><button class="ph4-demo-tab" data-demo-filter="delivered">Zugestellt</button></div>
<div class="ph4-package-list">
<div class="ph4-package" data-demo-state="active"><div class="ph4-package-icon">↗</div><div><strong>Kaffeebestellung</strong><small>UPS · Unterwegs · Wien</small><div class="ph4-progress"><span style="width:72%"></span></div></div><div class="ph4-package-meta">Morgen</div></div>
<div class="ph4-package" data-demo-state="active"><div class="ph4-package-icon">⌁</div><div><strong>Home-Assistant-Hardware</strong><small>17TRACK · Zoll abgeschlossen</small><div class="ph4-progress"><span style="width:49%"></span></div></div><div class="ph4-package-meta">ETA</div></div>
<div class="ph4-package" data-demo-state="delivered"><div class="ph4-package-icon">✓</div><div><strong>Druckerzubehör</strong><small>Zugestellt</small><div class="ph4-progress"><span style="width:100%"></span></div></div><div class="ph4-package-meta">Zugestellt</div></div>
</div></div>
</section>

<section class="ph4-section ph4-reveal"><div class="ph4-stats"><div class="ph4-stat"><strong>2</strong><span>Tracking-Provider</span></div><div class="ph4-stat"><strong>2</strong><span>Sprachen</span></div><div class="ph4-stat"><strong id="ph4-stars">—</strong><span>GitHub Stars</span></div><div class="ph4-stat"><strong id="ph4-version">Latest</strong><span>Version</span></div></div></section>

<section class="ph4-section ph4-reveal"><div class="ph4-section-head" markdown><div class="ph4-kicker">Warum PaketHub?</div>

## Jede Sendung. Ein einheitliches Erlebnis.

PaketHub verbirgt carrierspezifische Komplexität hinter einem konsistenten Datenmodell für Home Assistant.
</div>
<div class="ph4-feature-grid">
<div class="ph4-card"><div class="ph4-card-icon">◎</div><h3>Intelligente Provider-Auswahl</h3><p>Automatische Entscheidung zwischen nativem Tracking und Fallback.</p></div>
<div class="ph4-card"><div class="ph4-card-icon">▦</div><h3>Eigenes Dashboard</h3><p>Aktive und zugestellte Sendungen bleiben übersichtlich.</p></div>
<div class="ph4-card"><div class="ph4-card-icon">⌁</div><h3>Transparente Diagnose</h3><p>Provider-Nutzung und Fallbacks werden nachvollziehbar.</p></div>
<div class="ph4-card"><div class="ph4-card-icon">◉</div><h3>Automationsbereit</h3><p>Statusänderungen direkt in Home Assistant verwenden.</p></div>
<div class="ph4-card"><div class="ph4-card-icon">◇</div><h3>Datenschutzbewusst</h3><p>Sensible Informationen bleiben geschützt.</p></div>
<div class="ph4-card"><div class="ph4-card-icon">＋</div><h3>Erweiterbar</h3><p>Weitere native Carrier können ergänzt werden.</p></div>
</div></section>

<section class="ph4-section ph4-reveal"><div class="ph4-split"><div><div class="ph4-kicker">HACS</div><h2>In wenigen Minuten installiert</h2><p>Repository hinzufügen, PaketHub herunterladen und Home Assistant neu starten.</p></div><div class="ph4-panel"><div class="ph4-code">https://github.com/eifeldj/pakethub<button class="ph4-copy" data-copy-value="https://github.com/eifeldj/pakethub" data-copy-success="Kopiert">Kopieren</button></div><p>[Installationsanleitung öffnen →](installation.md)</p></div></div></section>

<section class="ph4-section ph4-reveal"><div class="ph4-split"><div class="ph4-panel"><div class="ph4-kicker">Provider intelligence</div><h2>Nativ, wenn möglich. Fallback, wenn nötig.</h2><div class="ph4-provider-controls"><button class="ph4-provider-button is-active" data-provider="ups">UPS</button><button class="ph4-provider-button" data-provider="unknown">Unknown</button><button class="ph4-provider-button" data-provider="fail">Failure</button></div><div class="ph4-provider-result"><span data-provider-result>UPS native provider selected</span><span class="ph4-provider-badge" data-provider-badge data-state="native">Native</span></div></div><div class="ph4-panel"><div class="ph4-kicker">Interactive tracking</div><h2>Erlebe den Paketfluss.</h2><div class="ph4-timeline"><div class="ph4-timeline-step"><div><strong>Registriert</strong><br><small>17TRACK registry</small></div></div><div class="ph4-timeline-step"><div><strong>Carrier erkannt</strong><br><small>Provider detection</small></div></div><div class="ph4-timeline-step"><div><strong>Unterwegs</strong><br><small>Normalized state</small></div></div><div class="ph4-timeline-step"><div><strong>Zugestellt</strong><br><small>Entity update</small></div></div></div><button class="ph4-run-button" data-run-timeline>Demo starten</button></div></div></section>

<section class="ph4-section ph4-reveal"><div class="ph4-section-head" markdown><div class="ph4-kicker">Ecosystem</div>

## Provider heute und morgen
</div><div class="ph4-provider-grid"><div class="ph4-provider-card"><strong>17TRACK</strong><br><span>Registrierung und Fallback</span><br><span class="ph4-provider-state ready">Available</span></div><div class="ph4-provider-card"><strong>UPS</strong><br><span>Nativer Provider</span><br><span class="ph4-provider-state ready">Available</span></div><div class="ph4-provider-card"><strong>DHL</strong><br><span>Zukünftiger Provider</span><br><span class="ph4-provider-state planned">Planned</span></div><div class="ph4-provider-card"><strong>Weitere Carrier</strong><br><span>Provider framework</span><br><span class="ph4-provider-state planned">Roadmap</span></div></div></section>

<section class="ph4-section ph4-reveal"><div class="ph4-section-head" markdown><div class="ph4-kicker">Architecture</div>

## Ein klarer Datenfluss
</div><div class="ph4-architecture"><div class="ph4-architecture-node">Home Assistant</div><div class="ph4-architecture-node">Coordinator</div><div class="ph4-architecture-node">Detection</div><div class="ph4-architecture-node">Native / Fallback</div><div class="ph4-architecture-node">Entities</div></div><p>[Architektur im Detail →](architecture.md)</p></section>

<section class="ph4-section ph4-cta ph4-reveal" markdown>
## Hol deine Pakete nach Hause.

Installiere PaketHub und integriere Paketverfolgung direkt in dein Home-Assistant-Dashboard.

[PaketHub installieren](installation.md){ .md-button .md-button--primary }
</section>

<footer class="ph4-footer"><div class="ph4-footer-grid"><div><h3>PaketHub</h3><p>Paketverfolgung für Home Assistant.</p></div><div><h4>Docs</h4><a href="installation/">Installation</a><a href="configuration/">Configuration</a><a href="dashboard-card/">Dashboard</a></div><div><h4>Project</h4><a href="roadmap/">Roadmap</a><a href="releases/">Releases</a><a href="development/">Development</a></div><div><h4>Community</h4><a href="https://github.com/eifeldj/pakethub">GitHub</a><a href="https://github.com/eifeldj/pakethub/issues">Issues</a><a href="https://github.com/eifeldj/pakethub/security">Security</a></div></div><div class="ph4-footer-bottom"><span>© Volker Moeltgen</span><span>Open Source · Home Assistant</span></div></footer>
</div>
