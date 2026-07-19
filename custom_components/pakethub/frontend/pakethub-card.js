const CARD_VERSION = "0.7.0";

const STATUS_META = {
  NotFound: { icon: "mdi:package-variant-remove", label: "Nicht gefunden", className: "muted" },
  InfoReceived: { icon: "mdi:package-variant", label: "Angekündigt", className: "info" },
  InTransit: { icon: "mdi:truck-fast-outline", label: "Unterwegs", className: "transit" },
  Expired: { icon: "mdi:package-variant-closed-minus", label: "Abgelaufen", className: "warning" },
  AvailableForPickup: { icon: "mdi:package-up", label: "Abholbereit", className: "delivery" },
  OutForDelivery: { icon: "mdi:truck-delivery-outline", label: "In Zustellung", className: "delivery" },
  DeliveryFailure: { icon: "mdi:package-variant-closed-remove", label: "Zustellung fehlgeschlagen", className: "error" },
  Delivered: { icon: "mdi:package-variant-closed-check", label: "Zugestellt", className: "delivered" },
  Exception: { icon: "mdi:alert-circle-outline", label: "Ausnahme", className: "error" },
  Unknown: { icon: "mdi:package-variant-closed", label: "Unbekannt", className: "muted" },
};

class PaketHubCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("pakethub-card-editor");
  }

  static getStubConfig() {
    return { title: "PaketHub", show_delivered: false, max_packages: 8 };
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = undefined;
    this._lastSignature = "";
  }

  setConfig(config) {
    this._config = {
      title: "PaketHub",
      show_delivered: false,
      max_packages: 8,
      sort_by: "status",
      ...config,
    };
    this._render(true);
  }

  set hass(hass) {
    this._hass = hass;
    const packages = this._getPackages();
    const signature = JSON.stringify(packages.map((p) => [p.entityId, p.state, p.progress, p.eta, p.latestEvent]));
    if (signature !== this._lastSignature) {
      this._lastSignature = signature;
      this._render(false, packages);
    }
  }

  getCardSize() {
    return Math.max(2, Math.min(this._getPackages().length * 2 + 1, 12));
  }

  _getPackages() {
    if (!this._hass) return [];
    let packages = Object.entries(this._hass.states)
      .filter(([entityId, state]) => entityId.startsWith("sensor.") && state.attributes?.pakethub_card === true)
      .map(([entityId, state]) => ({ entityId, state: state.state, ...state.attributes }));

    if (!this._config.show_delivered) {
      packages = packages.filter((item) => item.raw_status !== "Delivered");
    }

    const priority = { DeliveryFailure: 0, Exception: 0, OutForDelivery: 1, AvailableForPickup: 1, InTransit: 2, InfoReceived: 3, Unknown: 4, NotFound: 4, Expired: 5, Delivered: 6 };
    if (this._config.sort_by === "eta") {
      packages.sort((a, b) => (a.eta || "9999-12-31").localeCompare(b.eta || "9999-12-31"));
    } else if (this._config.sort_by === "name") {
      packages.sort((a, b) => (a.package_name || "").localeCompare(b.package_name || "", undefined, { sensitivity: "base" }));
    } else {
      packages.sort((a, b) => (priority[a.raw_status] ?? 9) - (priority[b.raw_status] ?? 9));
    }
    return packages.slice(0, Math.max(1, Number(this._config.max_packages) || 8));
  }

  _escape(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  _formatEta(item) {
    if (item.raw_status === "Delivered") return "Zugestellt";
    if (item.eta_is_today) return "Voraussichtlich heute";
    if (item.eta_is_tomorrow) return "Voraussichtlich morgen";
    if (item.eta_days_remaining !== null && item.eta_days_remaining !== undefined) {
      if (item.eta_days_remaining < 0) return "Voraussichtlicher Termin überschritten";
      return `Voraussichtlich in ${item.eta_days_remaining} Tagen`;
    }
    if (item.eta) {
      const parsed = new Date(`${item.eta}T00:00:00`);
      if (!Number.isNaN(parsed.valueOf())) return `Voraussichtlich ${parsed.toLocaleDateString(this._hass?.locale?.language || "de", { weekday: "long", day: "2-digit", month: "2-digit" })}`;
    }
    return "Kein Zustelltermin verfügbar";
  }

  _open(item) {
    if (this._config.tap_action === "more-info") {
      this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles: true, composed: true, detail: { entityId: item.entityId } }));
      return;
    }
    if (item.tracking_url) window.open(item.tracking_url, "_blank", "noopener,noreferrer");
  }

  _render(force = false, suppliedPackages) {
    if (!this.shadowRoot || !this._config) return;
    const packages = suppliedPackages || this._getPackages();
    const title = this._escape(this._config.title || "PaketHub");
    const body = packages.length
      ? packages.map((item, index) => {
          const meta = STATUS_META[item.raw_status] || STATUS_META.Unknown;
          const progress = Math.min(100, Math.max(0, Number(item.progress) || 0));
          const subtitle = [item.carrier, meta.label].filter(Boolean).join(" · ");
          const location = item.location ? `<div class="detail"><ha-icon icon="mdi:map-marker-outline"></ha-icon><span>${this._escape(item.location)}</span></div>` : "";
          const event = item.latest_event ? `<div class="event">${this._escape(item.latest_event)}</div>` : "";
          return `<button class="package ${meta.className}" data-index="${index}" type="button">
            <div class="topline">
              <div class="status-icon"><ha-icon icon="${meta.icon}"></ha-icon></div>
              <div class="heading">
                <div class="name">${this._escape(item.package_name || item.tracking_number || "Paket")}</div>
                <div class="subtitle">${this._escape(subtitle)}</div>
              </div>
              <div class="percent">${progress}%</div>
            </div>
            <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><div style="width:${progress}%"></div></div>
            <div class="eta">${this._escape(this._formatEta(item))}</div>
            ${location}${event}
          </button>`;
        }).join("")
      : `<div class="empty"><ha-icon icon="mdi:package-variant"></ha-icon><div><strong>Keine aktiven Pakete</strong><span>${this._config.show_delivered ? "Es sind noch keine Sendungen vorhanden." : "Zugestellte Pakete sind ausgeblendet."}</span></div></div>`;

    this.shadowRoot.innerHTML = `<style>
      :host { display:block; }
      ha-card { overflow:hidden; }
      .header { display:flex; align-items:center; justify-content:space-between; padding:18px 20px 12px; }
      .title { font-size:20px; font-weight:600; color:var(--primary-text-color); }
      .version { font-size:11px; color:var(--secondary-text-color); opacity:.7; }
      .content { padding:0 12px 12px; display:grid; gap:10px; }
      .package { width:100%; border:0; border-radius:16px; padding:14px; text-align:left; cursor:pointer; color:var(--primary-text-color); background:color-mix(in srgb, var(--card-background-color) 88%, var(--primary-color) 12%); font:inherit; transition:transform .15s ease, background .15s ease; }
      .package:hover { transform:translateY(-1px); background:color-mix(in srgb, var(--card-background-color) 82%, var(--primary-color) 18%); }
      .topline { display:flex; align-items:center; gap:12px; }
      .status-icon { width:42px; height:42px; border-radius:13px; display:grid; place-items:center; background:var(--secondary-background-color); color:var(--primary-color); flex:0 0 auto; }
      .status-icon ha-icon { --mdc-icon-size:25px; }
      .heading { min-width:0; flex:1; }
      .name { font-size:16px; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .subtitle { margin-top:2px; color:var(--secondary-text-color); font-size:13px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .percent { font-size:14px; font-weight:700; }
      .progress { height:7px; margin:12px 0 8px 54px; overflow:hidden; border-radius:999px; background:var(--divider-color); }
      .progress > div { height:100%; border-radius:inherit; background:var(--primary-color); transition:width .35s ease; }
      .eta { margin-left:54px; font-size:13px; font-weight:500; }
      .detail { margin:7px 0 0 54px; display:flex; align-items:center; gap:5px; color:var(--secondary-text-color); font-size:12px; }
      .detail ha-icon { --mdc-icon-size:15px; }
      .event { margin:6px 0 0 54px; color:var(--secondary-text-color); font-size:12px; line-height:1.35; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
      .package.error .status-icon, .package.warning .status-icon { color:var(--error-color); }
      .package.delivered .status-icon { color:var(--success-color, #43a047); }
      .package.delivery .status-icon { color:var(--warning-color, #ff9800); }
      .empty { padding:24px 12px 28px; display:flex; align-items:center; justify-content:center; gap:14px; color:var(--secondary-text-color); }
      .empty ha-icon { --mdc-icon-size:34px; }
      .empty strong, .empty span { display:block; }
      .empty strong { color:var(--primary-text-color); margin-bottom:3px; }
      @media (max-width: 450px) { .header { padding:16px 16px 10px; } .content { padding:0 8px 8px; } .package { padding:12px; } }
    </style>
    <ha-card>
      <div class="header"><div class="title">${title}</div><div class="version">v${CARD_VERSION}</div></div>
      <div class="content">${body}</div>
    </ha-card>`;

    this.shadowRoot.querySelectorAll(".package").forEach((element) => {
      element.addEventListener("click", () => this._open(packages[Number(element.dataset.index)]));
    });
  }
}

class PaketHubCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  set hass(hass) { this._hass = hass; }
  setConfig(config) { this._config = { title: "PaketHub", show_delivered: false, max_packages: 8, sort_by: "status", tap_action: "url", ...config }; this._render(); }
  _changed(key, value) {
    this._config = { ...this._config, [key]: value };
    this.dispatchEvent(new CustomEvent("config-changed", { bubbles: true, composed: true, detail: { config: this._config } }));
  }
  _render() {
    if (!this._config) return;
    this.shadowRoot.innerHTML = `<style>
      .form { display:grid; gap:16px; padding:8px 0; }
      label { display:grid; gap:6px; color:var(--primary-text-color); font-size:14px; }
      input, select { box-sizing:border-box; width:100%; min-height:42px; padding:8px 10px; border:1px solid var(--divider-color); border-radius:10px; color:var(--primary-text-color); background:var(--card-background-color); font:inherit; }
      .check { display:flex; align-items:center; gap:10px; }
      .check input { width:auto; min-height:auto; }
    </style><div class="form">
      <label>Titel<input id="title" value="${String(this._config.title || "").replaceAll('"','&quot;')}"></label>
      <label>Maximale Anzahl<input id="max" type="number" min="1" max="50" value="${Number(this._config.max_packages) || 8}"></label>
      <label>Sortierung<select id="sort"><option value="status" ${this._config.sort_by === "status" ? "selected" : ""}>Status</option><option value="eta" ${this._config.sort_by === "eta" ? "selected" : ""}>Zustelltermin</option><option value="name" ${this._config.sort_by === "name" ? "selected" : ""}>Name</option></select></label>
      <label>Aktion beim Antippen<select id="tap"><option value="url" ${this._config.tap_action !== "more-info" ? "selected" : ""}>17TRACK öffnen</option><option value="more-info" ${this._config.tap_action === "more-info" ? "selected" : ""}>Mehr Informationen</option></select></label>
      <label class="check"><input id="delivered" type="checkbox" ${this._config.show_delivered ? "checked" : ""}>Zugestellte Pakete anzeigen</label>
    </div>`;
    this.shadowRoot.getElementById("title").addEventListener("change", (e) => this._changed("title", e.target.value));
    this.shadowRoot.getElementById("max").addEventListener("change", (e) => this._changed("max_packages", Number(e.target.value)));
    this.shadowRoot.getElementById("sort").addEventListener("change", (e) => this._changed("sort_by", e.target.value));
    this.shadowRoot.getElementById("tap").addEventListener("change", (e) => this._changed("tap_action", e.target.value));
    this.shadowRoot.getElementById("delivered").addEventListener("change", (e) => this._changed("show_delivered", e.target.checked));
  }
}

customElements.define("pakethub-card", PaketHubCard);
customElements.define("pakethub-card-editor", PaketHubCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "pakethub-card",
  name: "PaketHub Card",
  description: "Übersicht aller von PaketHub verwalteten Sendungen",
  preview: true,
});
console.info(`%c PAKETHUB-CARD %c v${CARD_VERSION} `, "color:white;background:#334155;font-weight:700;padding:2px 5px;border-radius:3px 0 0 3px", "color:white;background:#0ea5e9;font-weight:700;padding:2px 5px;border-radius:0 3px 3px 0");
