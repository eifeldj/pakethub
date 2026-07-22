---
hide:
  - navigation
  - toc
description: PaketHub bringt intelligente und native Paketverfolgung in Home Assistant.
---

<div class="ph4-home">

<section class="ph4-hero">
<div class="ph4-orb one"></div>
<div class="ph4-orb two"></div>

<div markdown>
<span class="ph4-eyebrow">:material-home-assistant: Für Home Assistant entwickelt</span>

# Paketverfolgung, <span class="ph4-gradient-text">endlich zu Hause.</span>

<div class="ph4-hero-lead">PaketHub vereint 17TRACK, native Carrier-Provider, automatischen Fallback, Diagnose, Automationen und ein eigenes Dashboard-Erlebnis in einer Home-Assistant-Integration.</div>

<div class="ph4-actions">
[PaketHub installieren](installation.md){ .md-button .md-button--primary }
[Dokumentation entdecken](quickstart.md){ .md-button }
[Auf GitHub ansehen](https://github.com/eifeldj/pakethub){ .md-button }
</div>

<div class="ph4-trust">
<span>:material-check-circle: Native Provider zuerst</span>
<span>:material-check-circle: Automatischer Fallback</span>
<span>:material-check-circle: Open Source</span>
</div>
</div>

<div class="ph4-dashboard" data-demo-root>
  <div class="ph4-dashboard-head">
    <div class="ph4-dashboard-title">📦 PaketHub</div>
    <div class="ph4-live">LIVE</div>
  </div>

  <div class="ph4-demo-tabs">
    <button class="ph4-demo-tab is-active" data-demo-filter="all">Alle</button>
    <button class="ph4-demo-tab" data-demo-filter="active">Aktiv</button>
    <button class="ph4-demo-tab" data-demo-filter="delivered">Zugestellt</button>
  </div>

  <div class="ph4-package-list">
    <div class="ph4-package" data-demo-state="active">
      <div class="ph4-package-icon">↗</div>
      <div>
        <strong>Kaffeebestellung</strong>
        <small>UPS · Unterwegs · Wien</small>
        <div class="ph4-progress"><span style="width:72%"></span></div>
      </div>
      <div class="ph4-package-meta">Morgen</div>
    </div>

    <div class="ph4-package" data-demo-state="active">
      <div class="ph4-package-icon">⌁</div>
      <div>
        <strong>Home-Assistant-Hardware</strong>
        <small>17TRACK · Zoll abgeschlossen</small>
        <div class="ph4-progress"><span style="width:49%"></span></div>
      </div>
      <div class="ph4-package-meta">Termin offen</div>
    </div>

    <div class="ph4-package" data-demo-state="delivered">
      <div class="ph4-package-icon">✓</div>
      <div>
        <strong>Druckerzubehör</strong>
        <small>Zugestellt · Haustür</small>
        <div class="ph4-progress"><span style="width:100%"></span></div>
      </div>
      <div class="ph4-package-meta">Zugestellt</div>
    </div>
  </div>
</div>
</section>

<section class="ph4-section ph4-reveal">
<div class="ph4-stats">
  <div class="ph4-stat"><strong data-count="2">2</strong><span>Tracking-Provider</span></div>
  <div class="ph4-stat"><strong data-count="2">2</strong><span>Dokumentationssprachen</span></div>
  <div class="ph4-stat"><strong id="ph4-stars">—</strong><span>GitHub-Sterne</span></div>
  <div class="ph4-stat"><strong id="ph4-version">Latest</strong><span>aktuelle Version</span></div>
</div>
</section>

<section class="ph4-section ph4-reveal">
<div class="ph4-section-head" markdown>
<div class="ph4-kicker">Warum PaketHub?</div>

## Jede Sendung. Ein einheitliches Erlebnis.

PaketHub verbirgt carrierspezifische Komplexität hinter einem konsistenten, für Home Assistant entwickelten Datenmodell.
</div>

<div class="ph4-feature-grid">
  <div class="ph4-card"><div class="ph4-card-icon">:material-radar:</div><h3>Intelligente Provider-Auswahl</h3><p>PaketHub erkennt den passenden Provider und entscheidet automatisch zwischen nativem Tracking und Fallback.</p></div>
  <div class="ph4-card"><div class="ph4-card-icon">:material-view-dashboard-variant:</div><h3>Eigenes Dashboard</h3><p>Aktive, verspätete und zugestellte Sendungen bleiben auf Desktop und Smartphone übersichtlich.</p></div>
  <div class="ph4-card"><div class="ph4-card-icon">:material-chart-timeline-variant-shimmer:</div><h3>Transparente Diagnose</h3><p>Provider-Nutzung, Fallbacks, Laufzeiten und Synchronisierung machen Probleme nachvollziehbar.</p></div>
  <div class="ph4-card"><div class="ph4-card-icon">:material-bell-ring-outline:</div><h3>Automationsbereit</h3><p>Statusänderungen und Aktionen lassen sich direkt in Home-Assistant-Automationen verwenden.</p></div>
  <div class="ph4-card"><div class="ph4-card-icon">:material-shield-lock-outline:</div><h3>Datenschutzbewusst</h3><p>Zugangsdaten und private Sendungsinformationen gehören nicht in öffentliche Diagnosen.</p></div>
  <div class="ph4-card"><div class="ph4-card-icon">:material-puzzle-outline:</div><h3>Erweiterbar entwickelt</h3><p>Weitere native Carrier können ergänzt werden, ohne das Benutzererlebnis zu verändern.</p></div>
</div>
</section>

<section class="ph4-section ph4-reveal">
<div class="ph4-split">
  <div>
    <div class="ph4-kicker">In wenigen Minuten installiert</div>
    <h2>PaketHub über HACS hinzufügen</h2>
    <p>Repository-URL eintragen, Integration herunterladen und Home Assistant neu starten.</p>
    <div class="ph4-steps">
      <div class="ph4-step"><div><strong>Repository hinzufügen</strong><br><small>HACS → Integrationen → Custom repositories</small></div></div>
      <div class="ph4-step"><div><strong>PaketHub herunterladen</strong><br><small>Neueste stabile Version auswählen.</small></div></div>
      <div class="ph4-step"><div><strong>Neustarten und konfigurieren</strong><br><small>Integration in Home Assistant hinzufügen.</small></div></div>
    </div>
  </div>

  <div class="ph4-panel">
    <div class="ph4-code">
      https://github.com/eifeldj/pakethub
      <button class="ph4-copy" data-copy-value="https://github.com/eifeldj/pakethub" data-copy-success="Kopiert">Kopieren</button>
    </div>
    <p>[Vollständige Installationsanleitung →](installation.md)</p>
  </div>
</div>
</section>

<section class="ph4-section ph4-reveal">
<div class="ph4-split">
  <div class="ph4-panel">
    <div class="ph4-kicker">Intelligente Provider-Auswahl</div>
    <h2>Nativ, wenn möglich. Fallback, wenn nötig.</h2>
    <div class="ph4-provider-controls">
      <button class="ph4-provider-button is-active" data-provider="ups">UPS</button>
      <button class="ph4-provider-button" data-provider="unknown">Unknown carrier</button>
      <button class="ph4-provider-button" data-provider="fail">Native failure</button>
    </div>
    <div class="ph4-provider-result">
      <span data-provider-result>Nativer UPS-Provider ausgewählt</span>
      <span class="ph4-provider-badge" data-provider-badge data-state="native">Nativ</span>
    </div>
  </div>

  <div class="ph4-panel">
    <div class="ph4-kicker">Interaktive Sendungsverfolgung</div>
    <h2>Erlebe den Paketfluss.</h2>
    <div class="ph4-timeline">
      <div class="ph4-timeline-step"><div><strong>Registriert</strong><br><small>17TRACK registry</small></div></div>
      <div class="ph4-timeline-step"><div><strong>Carrier erkannt</strong><br><small>Provider detection</small></div></div>
      <div class="ph4-timeline-step"><div><strong>Unterwegs</strong><br><small>Normalized tracking state</small></div></div>
      <div class="ph4-timeline-step"><div><strong>Zugestellt</strong><br><small>Home Assistant entity update</small></div></div>
    </div>
    <button class="ph4-run-button" data-run-timeline>Demo starten</button>
  </div>
</div>
</section>

<section class="ph4-section ph4-reveal">
<div class="ph4-section-head" markdown>
<div class="ph4-kicker">Provider-Ökosystem</div>

## Provider heute und morgen
</div>

<div class="ph4-provider-grid">
  <div class="ph4-provider-card"><strong>17TRACK</strong><span>Register und Fallback</span><br><span class="ph4-provider-state ready">Verfügbar</span></div>
  <div class="ph4-provider-card"><strong>UPS</strong><span>Nativer Tracking-Provider</span><br><span class="ph4-provider-state ready">Verfügbar</span></div>
  <div class="ph4-provider-card"><strong>DHL</strong><span>Zukünftiger nativer Provider</span><br><span class="ph4-provider-state planned">Geplant</span></div>
  <div class="ph4-provider-card"><strong>Weitere Carrier</strong><span>Erweiterbares Framework</span><br><span class="ph4-provider-state planned">Roadmap</span></div>
</div>
</section>

<section class="ph4-section ph4-reveal">
<div class="ph4-section-head" markdown>
<div class="ph4-kicker">Architektur</div>

## Ein klarer Datenfluss
</div>

<div class="ph4-architecture">
  <div class="ph4-architecture-node">Home Assistant</div>
  <div class="ph4-architecture-node">PaketHub Coordinator</div>
  <div class="ph4-architecture-node">Provider Detection</div>
  <div class="ph4-architecture-node">Native / Fallback</div>
  <div class="ph4-architecture-node">Entities & Dashboard</div>
</div>

<p>[Architektur im Detail →](architecture.md)</p>
</section>

<section class="ph4-section ph4-faq ph4-reveal" markdown>
<div class="ph4-section-head">
<div class="ph4-kicker">Häufige Fragen</div>

## Fragen vor der ersten Sendung
</div>

??? question "Benötige ich ein 17TRACK-Konto?"
    Ja. PaketHub verwendet derzeit einen offiziellen 17TRACK-API-Schlüssel für Registrierung und Fallback-Tracking.

??? question "Was bedeutet nativer Provider?"
    Ein nativer Provider kommuniziert direkt mit einem carrierspezifischen Trackingdienst und normalisiert das Ergebnis.

??? question "Was geschieht bei einem Fehler?"
    PaketHub kann automatisch auf 17TRACK zurückfallen.

??? question "Kann ich Benachrichtigungen automatisieren?"
    Ja. PaketHub ist für Home-Assistant-Aktionen, Entitäten und Automationen ausgelegt.

??? question "Wo melde ich ein Problem?"
    Verwende die strukturierten GitHub-Issue-Vorlagen und entferne vorher sensible Daten.
</section>

<section class="ph4-section ph4-cta ph4-reveal" markdown>
## Hol deine Pakete nach Hause.

Installiere PaketHub und mache Paketverfolgung zu einem Teil deines Home-Assistant-Dashboards.

[PaketHub installieren](installation.md){ .md-button .md-button--primary }
[Schnellstart lesen](quickstart.md){ .md-button }
</section>

<footer class="ph4-footer">
  <div class="ph4-footer-grid">
    <div class="ph4-footer-brand">
      <h3>PaketHub</h3>
      <p>Native Paketverfolgung und Provider-Intelligenz für Home Assistant.</p>
    </div>
    <div>
      <h4>Dokumentation</h4>
      <a href="installation/">Installation</a>
      <a href="configuration/">Konfiguration</a>
      <a href="dashboard-card/">Dashboard-Karte</a>
    </div>
    <div>
      <h4>Projekt</h4>
      <a href="roadmap/">Roadmap</a>
      <a href="releases/">Versionen</a>
      <a href="development/">Entwicklung</a>
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
    <span>Open-Source-Software für die Home-Assistant-Community.</span>
  </div>
</footer>

</div>
