const CARD_VERSION = "0.8.0";

const STATUS_META = {
  NotFound: { icon: "mdi:package-variant-remove", label: "Nicht gefunden", cls: "muted", group: "pending" },
  InfoReceived: { icon: "mdi:package-variant", label: "Angekündigt", cls: "info", group: "pending" },
  InTransit: { icon: "mdi:truck-fast-outline", label: "Unterwegs", cls: "transit", group: "transit" },
  Expired: { icon: "mdi:package-variant-closed-minus", label: "Abgelaufen", cls: "error", group: "error" },
  AvailableForPickup: { icon: "mdi:package-up", label: "Abholbereit", cls: "delivery", group: "delivery" },
  OutForDelivery: { icon: "mdi:truck-delivery-outline", label: "In Zustellung", cls: "delivery", group: "delivery" },
  DeliveryFailure: { icon: "mdi:package-variant-closed-remove", label: "Zustellung fehlgeschlagen", cls: "error", group: "error" },
  Delivered: { icon: "mdi:package-variant-closed-check", label: "Zugestellt", cls: "delivered", group: "delivered" },
  Exception: { icon: "mdi:alert-circle-outline", label: "Ausnahme", cls: "error", group: "error" },
  Unknown: { icon: "mdi:package-variant-closed", label: "Unbekannt", cls: "muted", group: "pending" },
};

class PaketHubCard extends HTMLElement {
  static getConfigElement() { return document.createElement("pakethub-card-editor"); }
  static getStubConfig() { return { title: "PaketHub", show_delivered: false, max_packages: 8 }; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = undefined;
    this._signature = "";
    this._refreshing = false;
  }

  connectedCallback() { this._timer ||= setInterval(() => this._updateClock(), 30000); }
  disconnectedCallback() { clearInterval(this._timer); this._timer = undefined; }

  setConfig(config) {
    this._config = { title: "PaketHub", show_delivered: false, max_packages: 8, sort_by: "status", tap_action: "url", ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    const packages = this._packages();
    const signature = JSON.stringify([packages.map(p => [p.entityId, p.state, p.progress, p.eta, p.latest_event, p.location]), this._lastSync()?.state, this._refreshing]);
    if (signature !== this._signature) { this._signature = signature; this._render(packages); }
  }

  getCardSize() { return Math.max(3, Math.min(this._packages().length * 2 + 2, 14)); }

  _allPackages() {
    if (!this._hass) return [];
    return Object.entries(this._hass.states)
      .filter(([id, state]) => id.startsWith("sensor.") && state.attributes?.pakethub_card === true)
      .map(([entityId, state]) => ({ entityId, state: state.state, ...state.attributes }));
  }

  _packages() {
    let list = this._allPackages();
    if (!this._config.show_delivered) list = list.filter(p => p.raw_status !== "Delivered");
    const priority = { DeliveryFailure:0, Exception:0, OutForDelivery:1, AvailableForPickup:1, InTransit:2, InfoReceived:3, Unknown:4, NotFound:4, Expired:5, Delivered:6 };
    if (this._config.sort_by === "eta") list.sort((a,b) => (a.eta || "9999").localeCompare(b.eta || "9999"));
    else if (this._config.sort_by === "name") list.sort((a,b) => (a.package_name || "").localeCompare(b.package_name || "", undefined, { sensitivity:"base" }));
    else list.sort((a,b) => (priority[a.raw_status] ?? 9) - (priority[b.raw_status] ?? 9));
    return list.slice(0, Math.max(1, Number(this._config.max_packages) || 8));
  }

  _lastSync() {
    if (!this._hass) return undefined;
    return Object.values(this._hass.states).find(s => s.entity_id?.startsWith("sensor.") && s.attributes?.icon === "mdi:cloud-sync-outline");
  }

  _escape(v) { return String(v ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }

  _eta(item) {
    if (item.raw_status === "Delivered") return "Zugestellt";
    if (item.eta_is_today) return "Heute";
    if (item.eta_is_tomorrow) return "Morgen";
    if (item.eta_days_remaining != null && item.eta_days_remaining < 0) return "Termin überschritten";
    if (item.eta) {
      const d = new Date(`${item.eta}T00:00:00`);
      if (!Number.isNaN(d.valueOf())) return d.toLocaleDateString(this._hass?.locale?.language || "de", { weekday:"short", day:"2-digit", month:"2-digit" });
    }
    return "Keine ETA";
  }

  _relative(value) {
    const d = new Date(value);
    if (!value || Number.isNaN(d.valueOf())) return "Noch nicht synchronisiert";
    const sec = Math.max(0, Math.round((Date.now() - d.valueOf()) / 1000));
    if (sec < 45) return "gerade eben aktualisiert";
    const min = Math.round(sec / 60);
    if (min < 60) return `vor ${min} ${min === 1 ? "Minute" : "Minuten"} aktualisiert`;
    const hours = Math.round(min / 60);
    if (hours < 24) return `vor ${hours} ${hours === 1 ? "Stunde" : "Stunden"} aktualisiert`;
    const days = Math.round(hours / 24);
    return `vor ${days} ${days === 1 ? "Tag" : "Tagen"} aktualisiert`;
  }

  _updateClock() {
    const el = this.shadowRoot?.querySelector(".last-sync");
    if (el) el.textContent = this._relative(this._lastSync()?.state);
  }

  _summary() {
    const c = { active:0, transit:0, delivery:0, delivered:0, pending:0, error:0 };
    this._allPackages().forEach(p => {
      const group = (STATUS_META[p.raw_status] || STATUS_META.Unknown).group;
      if (group !== "delivered") c.active++;
      c[group]++;
    });
    return c;
  }

  _duplicates(list) {
    const counts = new Map();
    list.forEach(p => { const n = String(p.package_name || "").trim().toLowerCase(); if (n) counts.set(n, (counts.get(n) || 0) + 1); });
    return counts;
  }

  async _refresh() {
    if (!this._hass || this._refreshing) return;
    this._refreshing = true; this._render();
    try { await this._hass.callService("pakethub", "refresh", {}); }
    catch (err) { console.error("PaketHub refresh failed", err); }
    finally { setTimeout(() => { this._refreshing = false; this._signature = ""; this._render(); }, 700); }
  }

  _open(item) {
    if (this._config.tap_action === "more-info") {
      this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles:true, composed:true, detail:{ entityId:item.entityId } }));
    } else if (item.tracking_url) window.open(item.tracking_url, "_blank", "noopener,noreferrer");
  }

  _render(supplied) {
    if (!this.shadowRoot || !this._config) return;
    const packages = supplied || this._packages();
    const duplicates = this._duplicates(this._allPackages());
    const summary = this._summary();
    const body = packages.length ? packages.map((item,index) => {
      const meta = STATUS_META[item.raw_status] || STATUS_META.Unknown;
      const progress = Math.min(100, Math.max(0, Number(item.progress) || 0));
      const key = String(item.package_name || "").trim().toLowerCase();
      const number = String(item.tracking_number || "");
      const suffix = duplicates.get(key) > 1 && number ? `<span class="suffix">…${this._escape(number.slice(-4))}</span>` : "";
      const location = item.location ? `<div class="detail"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${this._escape(item.location)}</div>` : "";
      const event = item.latest_event ? `<div class="event">${this._escape(item.latest_event)}</div>` : "";
      return `<button class="package ${meta.cls}" data-index="${index}" type="button">
        <div class="topline"><div class="status-icon"><ha-icon icon="${meta.icon}"></ha-icon></div>
        <div class="heading"><div class="name-row"><div class="name">${this._escape(item.package_name || item.tracking_number || "Paket")}</div>${suffix}</div><div class="carrier">${this._escape(item.carrier || "")}</div></div>
        <div class="chip"><i></i>${this._escape(meta.label)}</div></div>
        <div class="progress-row"><div class="progress"><div style="width:${progress}%"></div></div><div class="percent">${progress}%</div></div>
        <div class="eta"><ha-icon icon="mdi:calendar-clock-outline"></ha-icon>${this._escape(this._eta(item))}</div>${location}${event}
      </button>`;
    }).join("") : `<div class="empty"><ha-icon icon="mdi:package-variant"></ha-icon><div><strong>Keine aktiven Pakete</strong><span>${this._config.show_delivered ? "Es sind noch keine Sendungen vorhanden." : "Zugestellte Pakete sind ausgeblendet."}</span></div></div>`;

    this.shadowRoot.innerHTML = `<style>
      :host{display:block} ha-card{overflow:hidden}.header{padding:18px 20px 14px;border-bottom:1px solid var(--divider-color)}
      .header-top{display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:10px}.brand-icon{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--primary-color) 16%,transparent);color:var(--primary-color)}
      .title{font-size:20px;font-weight:700}.version{font-size:11px;color:var(--secondary-text-color);margin-top:2px}.refresh{width:40px;height:40px;border:0;border-radius:50%;display:grid;place-items:center;background:transparent;color:var(--primary-text-color);cursor:pointer}.refresh:hover{background:var(--secondary-background-color)}.refreshing ha-icon{animation:spin .8s linear infinite}
      .summary{margin-top:14px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.summary-item{padding:9px 8px;border-radius:12px;background:var(--secondary-background-color);text-align:center}.summary-value{display:block;font-size:17px;font-weight:700}.summary-label{display:block;font-size:11px;color:var(--secondary-text-color)}.last-sync{margin-top:10px;font-size:12px;color:var(--secondary-text-color)}
      .content{padding:12px;display:grid;gap:10px}.package{--status-color:var(--primary-color);width:100%;border:0;border-radius:16px;padding:14px;text-align:left;cursor:pointer;color:var(--primary-text-color);background:color-mix(in srgb,var(--card-background-color) 88%,var(--primary-color) 12%);font:inherit}.package:hover{transform:translateY(-1px)}
      .transit{--status-color:var(--warning-color,#ff9800)}.delivery{--status-color:var(--info-color,#039be5)}.delivered{--status-color:var(--success-color,#43a047)}.error{--status-color:var(--error-color,#db4437)}.muted,.info{--status-color:var(--secondary-text-color)}
      .topline{display:flex;align-items:center;gap:12px}.status-icon{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:var(--secondary-background-color);color:var(--status-color);flex:0 0 auto}.heading{min-width:0;flex:1}.name-row{display:flex;align-items:baseline;gap:7px}.name{font-size:16px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.suffix{font-size:12px;color:var(--secondary-text-color)}.carrier{margin-top:2px;font-size:13px;color:var(--secondary-text-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .chip{max-width:42%;display:flex;align-items:center;gap:6px;padding:6px 9px;border-radius:999px;color:var(--status-color);background:color-mix(in srgb,var(--status-color) 14%,transparent);font-size:11px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chip i{width:7px;height:7px;border-radius:50%;background:currentColor;flex:0 0 auto}
      .progress-row{margin:12px 0 8px 54px;display:flex;align-items:center;gap:10px}.progress{height:7px;flex:1;border-radius:999px;overflow:hidden;background:var(--divider-color)}.progress>div{height:100%;border-radius:inherit;background:var(--status-color);transition:width .35s}.percent{font-size:12px;font-weight:700;color:var(--secondary-text-color)}.eta,.detail{margin-left:54px;display:flex;align-items:center;gap:5px;font-size:12px}.eta{font-size:13px;font-weight:550}.eta ha-icon,.detail ha-icon{--mdc-icon-size:16px;color:var(--status-color)}.detail{margin-top:7px;color:var(--secondary-text-color)}.event{margin:6px 0 0 54px;color:var(--secondary-text-color);font-size:12px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .empty{padding:24px 12px 28px;display:flex;justify-content:center;gap:14px;color:var(--secondary-text-color)}.empty strong,.empty span{display:block}.empty strong{color:var(--primary-text-color)}@keyframes spin{to{transform:rotate(360deg)}}
      @media(max-width:520px){.header{padding:16px 14px 12px}.summary{grid-template-columns:repeat(2,1fr)}.content{padding:8px}.package{padding:12px}.chip{max-width:38%;padding:5px 7px}}
    </style><ha-card><div class="header"><div class="header-top"><div class="brand"><div class="brand-icon"><ha-icon icon="mdi:package-variant-closed"></ha-icon></div><div><div class="title">${this._escape(this._config.title || "PaketHub")}</div><div class="version">Dashboard v${CARD_VERSION}</div></div></div><button class="refresh ${this._refreshing ? "refreshing" : ""}" ${this._refreshing ? "disabled" : ""}><ha-icon icon="mdi:refresh"></ha-icon></button></div>
      <div class="summary"><div class="summary-item"><span class="summary-value">${summary.active}</span><span class="summary-label">Aktiv</span></div><div class="summary-item"><span class="summary-value">${summary.transit + summary.delivery}</span><span class="summary-label">Unterwegs</span></div><div class="summary-item"><span class="summary-value">${summary.delivered}</span><span class="summary-label">Zugestellt</span></div><div class="summary-item"><span class="summary-value">${summary.error}</span><span class="summary-label">Probleme</span></div></div><div class="last-sync">${this._escape(this._relative(this._lastSync()?.state))}</div></div><div class="content">${body}</div></ha-card>`;
    this.shadowRoot.querySelector(".refresh")?.addEventListener("click", () => this._refresh());
    this.shadowRoot.querySelectorAll(".package").forEach(el => el.addEventListener("click", () => this._open(packages[Number(el.dataset.index)])));
  }
}

class PaketHubCardEditor extends HTMLElement {
  constructor(){super();this.attachShadow({mode:"open"})} set hass(h){this._hass=h}
  setConfig(c){this._config={title:"PaketHub",show_delivered:false,max_packages:8,sort_by:"status",tap_action:"url",...c};this._render()}
  _changed(k,v){this._config={...this._config,[k]:v};this.dispatchEvent(new CustomEvent("config-changed",{bubbles:true,composed:true,detail:{config:this._config}}))}
  _render(){if(!this._config)return;this.shadowRoot.innerHTML=`<style>.form{display:grid;gap:16px;padding:8px 0}label{display:grid;gap:6px;color:var(--primary-text-color);font-size:14px}input,select{box-sizing:border-box;width:100%;min-height:42px;padding:8px 10px;border:1px solid var(--divider-color);border-radius:10px;color:var(--primary-text-color);background:var(--card-background-color);font:inherit}.check{display:flex;align-items:center;gap:10px}.check input{width:auto;min-height:auto}</style><div class="form"><label>Titel<input id="title" value="${String(this._config.title||"").replaceAll('"','&quot;')}"></label><label>Maximale Anzahl<input id="max" type="number" min="1" max="50" value="${Number(this._config.max_packages)||8}"></label><label>Sortierung<select id="sort"><option value="status" ${this._config.sort_by==="status"?"selected":""}>Status</option><option value="eta" ${this._config.sort_by==="eta"?"selected":""}>Zustelltermin</option><option value="name" ${this._config.sort_by==="name"?"selected":""}>Name</option></select></label><label>Aktion beim Antippen<select id="tap"><option value="url" ${this._config.tap_action!=="more-info"?"selected":""}>17TRACK öffnen</option><option value="more-info" ${this._config.tap_action==="more-info"?"selected":""}>Mehr Informationen</option></select></label><label class="check"><input id="delivered" type="checkbox" ${this._config.show_delivered?"checked":""}>Zugestellte Pakete anzeigen</label></div>`;this.shadowRoot.getElementById("title").addEventListener("change",e=>this._changed("title",e.target.value));this.shadowRoot.getElementById("max").addEventListener("change",e=>this._changed("max_packages",Number(e.target.value)));this.shadowRoot.getElementById("sort").addEventListener("change",e=>this._changed("sort_by",e.target.value));this.shadowRoot.getElementById("tap").addEventListener("change",e=>this._changed("tap_action",e.target.value));this.shadowRoot.getElementById("delivered").addEventListener("change",e=>this._changed("show_delivered",e.target.checked))}
}

if(!customElements.get("pakethub-card"))customElements.define("pakethub-card",PaketHubCard);
if(!customElements.get("pakethub-card-editor"))customElements.define("pakethub-card-editor",PaketHubCardEditor);
window.customCards=window.customCards||[];
if(!window.customCards.some(c=>c.type==="pakethub-card"))window.customCards.push({type:"pakethub-card",name:"PaketHub Card",description:"Übersicht aller von PaketHub verwalteten Sendungen",preview:true});
console.info(`%c PAKETHUB-CARD %c v${CARD_VERSION} `,"color:white;background:#334155;font-weight:700;padding:2px 5px","color:white;background:#0ea5e9;font-weight:700;padding:2px 5px");
