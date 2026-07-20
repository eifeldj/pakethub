const CARD_VERSION = "1.1.0";

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

const CARRIER_META = [
  { match: /austrian post|österreichische post|post at|post\.at/i, short: "POST", icon: "mdi:postage-stamp" },
  { match: /dhl/i, short: "DHL", icon: "mdi:package-variant-closed" },
  { match: /ups/i, short: "UPS", icon: "mdi:shield-package" },
  { match: /fedex/i, short: "FDX", icon: "mdi:airplane" },
  { match: /gls/i, short: "GLS", icon: "mdi:truck-fast-outline" },
  { match: /dpd/i, short: "DPD", icon: "mdi:cube-send" },
  { match: /amazon/i, short: "AMZ", icon: "mdi:shopping-outline" },
  { match: /yunexpress|yun express/i, short: "YUN", icon: "mdi:airplane-takeoff" },
  { match: /hermes|evri/i, short: "HMS", icon: "mdi:truck-outline" },
];

const TEXT = {
  de: {
    not_found:"Nicht gefunden", announced:"Angekündigt", transit:"Unterwegs", expired:"Abgelaufen", pickup:"Abholbereit", out:"In Zustellung", failed:"Zustellung fehlgeschlagen", delivered:"Zugestellt", exception:"Ausnahme", unknown:"Unbekannt",
    today:"Heute", tomorrow:"Morgen", overdue:"Termin überschritten", no_eta:"Keine ETA", eta:"ETA", active:"Aktiv", problems:"Probleme", packages_transit:"Unterwegs", no_active:"Keine aktiven Pakete", no_shipments:"Es sind noch keine Sendungen vorhanden.", delivered_hidden:"Zugestellte Pakete sind ausgeblendet.",
    just_now:"gerade eben aktualisiert", minute:"Minute", minutes:"Minuten", hour:"Stunde", hours:"Stunden", day:"Tag", days:"Tagen", not_synced:"Noch nicht synchronisiert",
    details:"Paketdetails", carrier_unknown:"Paketdienst unbekannt", tracking_number:"Trackingnummer", unavailable:"Nicht verfügbar", copy:"Trackingnummer kopieren", open_17:"Bei 17TRACK öffnen", ha_details:"Home-Assistant-Details", history:"Sendungsverlauf", no_events:"Noch keine Tracking-Ereignisse vorhanden.", status_update:"Statusaktualisierung", time_unknown:"Zeit unbekannt"
  },
  en: {
    not_found:"Not found", announced:"Info received", transit:"In transit", expired:"Expired", pickup:"Ready for pickup", out:"Out for delivery", failed:"Delivery failed", delivered:"Delivered", exception:"Exception", unknown:"Unknown",
    today:"Today", tomorrow:"Tomorrow", overdue:"ETA overdue", no_eta:"No ETA", eta:"ETA", active:"Active", problems:"Problems", packages_transit:"In transit", no_active:"No active packages", no_shipments:"No shipments are available yet.", delivered_hidden:"Delivered packages are hidden.",
    just_now:"updated just now", minute:"minute", minutes:"minutes", hour:"hour", hours:"hours", day:"day", days:"days", not_synced:"Not synchronized yet",
    details:"Package details", carrier_unknown:"Unknown carrier", tracking_number:"Tracking number", unavailable:"Unavailable", copy:"Copy tracking number", open_17:"Open in 17TRACK", ha_details:"Home Assistant details", history:"Tracking history", no_events:"No tracking events available yet.", status_update:"Tracking update", time_unknown:"Time unknown"
  }
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
    this._config = { title: "PaketHub", show_delivered: false, max_packages: 8, sort_by: "status", tap_action: "details", ...config };
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

  _lang() { return String(this._hass?.locale?.language || "de").toLowerCase().startsWith("de") ? "de" : "en"; }
  _t(key) { return TEXT[this._lang()]?.[key] || TEXT.en[key] || key; }
  _statusMeta(raw) {
    const base = STATUS_META[raw] || STATUS_META.Unknown;
    const keys = {NotFound:"not_found",InfoReceived:"announced",InTransit:"transit",Expired:"expired",AvailableForPickup:"pickup",OutForDelivery:"out",DeliveryFailure:"failed",Delivered:"delivered",Exception:"exception",Unknown:"unknown"};
    return {...base, label:this._t(keys[raw] || "unknown")};
  }
  _carrierMeta(name) {
    const carrier = String(name || "");
    return CARRIER_META.find(item => item.match.test(carrier)) || {short:(carrier.replace(/[^A-Za-z0-9]/g,"").slice(0,3).toUpperCase() || "PKG"), icon:"mdi:truck-outline"};
  }

  _eta(item) {
    if (item.raw_status === "Delivered") return this._t("delivered");
    if (item.eta_is_today) return this._t("today");
    if (item.eta_is_tomorrow) return this._t("tomorrow");
    if (item.eta_days_remaining != null && item.eta_days_remaining < 0) return this._t("overdue");
    if (item.eta) {
      const d = new Date(`${item.eta}T00:00:00`);
      if (!Number.isNaN(d.valueOf())) return d.toLocaleDateString(this._hass?.locale?.language || "de", { weekday:"short", day:"2-digit", month:"2-digit" });
    }
    return this._t("no_eta");
  }

  _relative(value) {
    const d = new Date(value);
    if (!value || Number.isNaN(d.valueOf())) return this._t("not_synced");
    const sec = Math.max(0, Math.round((Date.now() - d.valueOf()) / 1000));
    if (sec < 45) return this._t("just_now");
    const min = Math.round(sec / 60);
    if (min < 60) return this._lang() === "de" ? `vor ${min} ${min === 1 ? this._t("minute") : this._t("minutes")} aktualisiert` : `updated ${min} ${min === 1 ? this._t("minute") : this._t("minutes")} ago`;
    const hours = Math.round(min / 60);
    if (hours < 24) return this._lang() === "de" ? `vor ${hours} ${hours === 1 ? this._t("hour") : this._t("hours")} aktualisiert` : `updated ${hours} ${hours === 1 ? this._t("hour") : this._t("hours")} ago`;
    const days = Math.round(hours / 24);
    return this._lang() === "de" ? `vor ${days} ${days === 1 ? this._t("day") : this._t("days")} aktualisiert` : `updated ${days} ${days === 1 ? this._t("day") : this._t("days")} ago`;
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
    if (this._config.tap_action === "url") {
      if (item.tracking_url) window.open(item.tracking_url, "_blank", "noopener,noreferrer");
      return;
    }
    if (this._config.tap_action === "more-info") {
      this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles:true, composed:true, detail:{ entityId:item.entityId } }));
      return;
    }
    this._openDetail(item);
  }

  _formatDate(value) {
    const date = new Date(value);
    if (!value || Number.isNaN(date.valueOf())) return this._t("time_unknown");
    return date.toLocaleString(this._hass?.locale?.language || "de", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" });
  }

  _openDetail(item) {
    const timeline = Array.isArray(item.timeline) ? item.timeline : (Array.isArray(item.history) ? item.history : []);
    const meta = this._statusMeta(item.raw_status);
    const events = timeline.length ? timeline.map((event,index) => {
      const description = event?.description || this._t("status_update");
      const location = event?.location ? `<div class="timeline-location"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${this._escape(event.location)}</div>` : "";
      const provider = event?.provider ? `<span>${this._escape(event.provider)}</span>` : "";
      return `<div class="timeline-event ${index === 0 ? "current" : ""}"><div class="timeline-marker"><i></i></div><div class="timeline-card"><div class="timeline-head"><strong>${this._escape(description)}</strong><time>${this._escape(this._formatDate(event?.time))}</time></div>${location}<div class="timeline-provider">${provider}</div></div></div>`;
    }).join("") : `<div class="no-events"><ha-icon icon="mdi:timeline-clock-outline"></ha-icon><span>${this._escape(this._t("no_events"))}</span></div>`;
    const number = this._escape(item.tracking_number || "");
    const urlButton = item.tracking_url ? `<button class="detail-action primary" data-action="track"><ha-icon icon="mdi:open-in-new"></ha-icon>${this._escape(this._t("open_17"))}</button>` : "";
    this.shadowRoot.insertAdjacentHTML("beforeend", `<div class="modal-backdrop" role="presentation"><section class="detail-modal ${meta.cls}" role="dialog" aria-modal="true" aria-label="${this._escape(this._t("details"))}"><header><button class="icon-button" data-action="close" aria-label="Schließen"><ha-icon icon="mdi:arrow-left"></ha-icon></button><div class="detail-title"><strong>${this._escape(item.package_name || item.tracking_number || "Paket")}</strong><span>${this._escape(item.carrier || this._t("carrier_unknown"))}</span></div><div class="detail-status"><ha-icon icon="${meta.icon}"></ha-icon>${this._escape(meta.label)}</div></header><div class="detail-content"><div class="tracking-box"><div><span>${this._escape(this._t("tracking_number"))}</span><strong>${number || this._t("unavailable")}</strong></div>${number ? `<button class="icon-button" data-action="copy" aria-label="${this._escape(this._t("copy"))}"><ha-icon icon="mdi:content-copy"></ha-icon></button>` : ""}</div><div class="detail-actions">${urlButton}<button class="detail-action" data-action="more"><ha-icon icon="mdi:information-outline"></ha-icon>${this._escape(this._t("ha_details"))}</button></div><h3>${this._escape(this._t("history"))}</h3><div class="timeline">${events}</div></div></section></div>`);
    const backdrop = this.shadowRoot.querySelector(".modal-backdrop");
    backdrop?.addEventListener("click", event => { if (event.target === backdrop) this._closeDetail(); });
    backdrop?.querySelector('[data-action="close"]')?.addEventListener("click", () => this._closeDetail());
    backdrop?.querySelector('[data-action="copy"]')?.addEventListener("click", async event => {
      try { await navigator.clipboard.writeText(item.tracking_number || ""); event.currentTarget.innerHTML = '<ha-icon icon="mdi:check"></ha-icon>'; }
      catch (err) { console.warn("PaketHub: Trackingnummer konnte nicht kopiert werden", err); }
    });
    backdrop?.querySelector('[data-action="track"]')?.addEventListener("click", () => window.open(item.tracking_url, "_blank", "noopener,noreferrer"));
    backdrop?.querySelector('[data-action="more"]')?.addEventListener("click", () => { this._closeDetail(); this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles:true, composed:true, detail:{ entityId:item.entityId } })); });
    this._escapeHandler = event => { if (event.key === "Escape") this._closeDetail(); };
    window.addEventListener("keydown", this._escapeHandler);
  }

  _closeDetail() {
    this.shadowRoot?.querySelector(".modal-backdrop")?.remove();
    if (this._escapeHandler) window.removeEventListener("keydown", this._escapeHandler);
    this._escapeHandler = undefined;
  }

  _render(supplied) {
    if (!this.shadowRoot || !this._config) return;
    const packages = supplied || this._packages();
    const duplicates = this._duplicates(this._allPackages());
    const summary = this._summary();
    const body = packages.length ? packages.map((item,index) => {
      const meta = this._statusMeta(item.raw_status);
      const progress = Math.min(100, Math.max(0, Number(item.progress) || 0));
      const key = String(item.package_name || "").trim().toLowerCase();
      const number = String(item.tracking_number || "");
      const suffix = duplicates.get(key) > 1 && number ? `<span class="suffix">…${this._escape(number.slice(-4))}</span>` : "";
      const carrierMeta = this._carrierMeta(item.carrier);
      const location = item.location ? `<div class="detail"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${this._escape(item.location)}</div>` : "";
      const event = item.latest_event ? `<div class="event">${this._escape(item.latest_event)}</div>` : "";
      const copy = number ? `<button class="copy-inline" data-copy="${index}" type="button" aria-label="${this._escape(this._t("copy"))}" title="${this._escape(this._t("copy"))}"><ha-icon icon="mdi:content-copy"></ha-icon></button>` : "";
      return `<article class="package ${meta.cls}" data-index="${index}" tabindex="0" role="button">
        <div class="topline"><div class="carrier-logo" title="${this._escape(item.carrier || this._t("carrier_unknown"))}"><ha-icon icon="${carrierMeta.icon}"></ha-icon><small>${this._escape(carrierMeta.short)}</small></div>
        <div class="heading"><div class="name-row"><div class="name">${this._escape(item.package_name || item.tracking_number || "Package")}</div>${suffix}${copy}</div><div class="carrier">${this._escape(item.carrier || this._t("carrier_unknown"))}</div></div>
        <div class="chip"><i></i>${this._escape(meta.label)}</div></div>
        <div class="progress-row"><div class="progress"><div style="width:${progress}%"></div></div><div class="percent">${progress}%</div></div>
        <div class="info-grid"><div class="eta-block"><span>${this._escape(this._t("eta"))}</span><strong><ha-icon icon="mdi:calendar-clock-outline"></ha-icon>${this._escape(this._eta(item))}</strong></div>${location}</div>${event}
      </article>`;
    }).join("") : `<div class="empty"><ha-icon icon="mdi:package-variant"></ha-icon><div><strong>${this._escape(this._t("no_active"))}</strong><span>${this._escape(this._config.show_delivered ? this._t("no_shipments") : this._t("delivered_hidden"))}</span></div></div>`;

    this.shadowRoot.innerHTML = `<style>
      :host{display:block} ha-card{overflow:hidden}.header{padding:18px 20px 14px;border-bottom:1px solid var(--divider-color)}
      .header-top{display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:10px}.brand-icon{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--primary-color) 16%,transparent);color:var(--primary-color)}
      .title{font-size:20px;font-weight:700}.version{font-size:11px;color:var(--secondary-text-color);margin-top:2px}.refresh{width:40px;height:40px;border:0;border-radius:50%;display:grid;place-items:center;background:transparent;color:var(--primary-text-color);cursor:pointer}.refresh:hover{background:var(--secondary-background-color)}.refreshing ha-icon{animation:spin .8s linear infinite}
      .summary{margin-top:14px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.summary-item{padding:9px 8px;border-radius:12px;background:var(--secondary-background-color);text-align:center}.summary-value{display:block;font-size:17px;font-weight:700}.summary-label{display:block;font-size:11px;color:var(--secondary-text-color)}.last-sync{margin-top:10px;font-size:12px;color:var(--secondary-text-color)}
      .content{padding:14px;display:grid;gap:12px}.package{--status-color:var(--primary-color);width:100%;border:0;border-radius:18px;padding:18px;text-align:left;cursor:pointer;color:var(--primary-text-color);background:color-mix(in srgb,var(--card-background-color) 88%,var(--primary-color) 12%);font:inherit}.package:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(0,0,0,.12)}.package:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}
      .transit{--status-color:var(--warning-color,#ff9800)}.delivery{--status-color:var(--info-color,#039be5)}.delivered{--status-color:var(--success-color,#43a047)}.error{--status-color:var(--error-color,#db4437)}.muted,.info{--status-color:var(--secondary-text-color)}
      .topline{display:flex;align-items:center;gap:12px}.carrier-logo{width:48px;height:48px;border-radius:14px;display:grid;grid-template-rows:1fr auto;place-items:center;background:var(--secondary-background-color);color:var(--status-color);flex:0 0 auto;padding:5px;box-sizing:border-box}.carrier-logo ha-icon{--mdc-icon-size:23px}.carrier-logo small{font-size:8px;font-weight:800;letter-spacing:.4px;line-height:1}.heading{min-width:0;flex:1}.name-row{display:flex;align-items:center;gap:7px}.name{font-size:16px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.suffix{font-size:12px;color:var(--secondary-text-color)}.copy-inline{width:28px;height:28px;border:0;border-radius:8px;display:grid;place-items:center;background:transparent;color:var(--secondary-text-color);cursor:pointer;flex:0 0 auto}.copy-inline:hover{background:var(--secondary-background-color);color:var(--primary-text-color)}.copy-inline ha-icon{--mdc-icon-size:16px}.carrier{margin-top:2px;font-size:13px;color:var(--secondary-text-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .chip{max-width:42%;display:flex;align-items:center;gap:6px;padding:6px 9px;border-radius:999px;color:var(--status-color);background:color-mix(in srgb,var(--status-color) 14%,transparent);font-size:11px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chip i{width:7px;height:7px;border-radius:50%;background:currentColor;flex:0 0 auto}
      .progress-row{margin:16px 0 12px 60px;display:flex;align-items:center;gap:10px}.progress{height:7px;flex:1;border-radius:999px;overflow:hidden;background:var(--divider-color)}.progress>div{height:100%;border-radius:inherit;background:var(--status-color);transition:width .35s}.percent{font-size:12px;font-weight:700;color:var(--secondary-text-color)}.info-grid{margin-left:60px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}.eta-block{min-width:112px;padding:9px 11px;border-radius:12px;background:var(--secondary-background-color)}.eta-block span{display:block;font-size:9px;text-transform:uppercase;letter-spacing:.7px;color:var(--secondary-text-color);margin-bottom:4px}.eta-block strong{display:flex;align-items:center;gap:6px;font-size:13px}.eta-block ha-icon,.detail ha-icon{--mdc-icon-size:16px;color:var(--status-color)}.detail{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--secondary-text-color)}.event{margin:10px 0 0 60px;color:var(--secondary-text-color);font-size:12px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .modal-backdrop{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:18px;background:rgba(0,0,0,.58);backdrop-filter:blur(4px)}.detail-modal{--status-color:var(--primary-color);width:min(760px,100%);max-height:min(88vh,900px);overflow:hidden;border-radius:22px;background:var(--card-background-color);box-shadow:0 24px 80px rgba(0,0,0,.45);color:var(--primary-text-color)}.detail-modal.transit{--status-color:var(--warning-color,#ff9800)}.detail-modal.delivery{--status-color:var(--info-color,#039be5)}.detail-modal.delivered{--status-color:var(--success-color,#43a047)}.detail-modal.error{--status-color:var(--error-color,#db4437)}.detail-modal.muted,.detail-modal.info{--status-color:var(--secondary-text-color)}.detail-modal header{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid var(--divider-color)}.icon-button{width:40px;height:40px;border:0;border-radius:50%;display:grid;place-items:center;background:transparent;color:var(--primary-text-color);cursor:pointer}.icon-button:hover{background:var(--secondary-background-color)}.detail-title{min-width:0;flex:1}.detail-title strong,.detail-title span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.detail-title strong{font-size:18px}.detail-title span{font-size:12px;color:var(--secondary-text-color);margin-top:2px}.detail-status{display:flex;align-items:center;gap:7px;padding:7px 10px;border-radius:999px;color:var(--status-color);background:color-mix(in srgb,var(--status-color) 14%,transparent);font-size:12px;font-weight:700}.detail-status ha-icon{--mdc-icon-size:18px}.detail-content{padding:18px;max-height:calc(88vh - 74px);overflow:auto}.tracking-box{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:15px;background:var(--secondary-background-color)}.tracking-box>div{min-width:0;flex:1}.tracking-box span,.tracking-box strong{display:block}.tracking-box span{font-size:11px;color:var(--secondary-text-color);margin-bottom:4px}.tracking-box strong{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;overflow-wrap:anywhere}.detail-actions{display:flex;gap:10px;margin:12px 0 20px}.detail-action{flex:1;min-height:43px;border:1px solid var(--divider-color);border-radius:12px;padding:9px 12px;display:flex;align-items:center;justify-content:center;gap:7px;background:transparent;color:var(--primary-text-color);font:inherit;font-weight:650;cursor:pointer}.detail-action.primary{border-color:var(--primary-color);background:var(--primary-color);color:var(--text-primary-color,#fff)}.detail-action ha-icon{--mdc-icon-size:19px}.detail-content h3{margin:0 0 14px;font-size:16px}.timeline{position:relative}.timeline-event{display:grid;grid-template-columns:24px 1fr;gap:10px;position:relative;padding-bottom:14px}.timeline-event:not(:last-child):before{content:"";position:absolute;left:11px;top:20px;bottom:-4px;width:2px;background:var(--divider-color)}.timeline-marker{display:grid;place-items:start center;padding-top:7px}.timeline-marker i{width:10px;height:10px;border:3px solid var(--card-background-color);border-radius:50%;background:var(--secondary-text-color);box-shadow:0 0 0 2px var(--divider-color);z-index:1}.timeline-event.current .timeline-marker i{background:var(--status-color);box-shadow:0 0 0 3px color-mix(in srgb,var(--status-color) 25%,transparent)}.timeline-card{padding:12px 14px;border-radius:14px;background:var(--secondary-background-color)}.timeline-event.current .timeline-card{background:color-mix(in srgb,var(--status-color) 12%,var(--secondary-background-color))}.timeline-head{display:flex;gap:12px;justify-content:space-between}.timeline-head strong{font-size:13px;line-height:1.4}.timeline-head time{flex:0 0 auto;font-size:11px;color:var(--secondary-text-color)}.timeline-location{display:flex;align-items:center;gap:5px;margin-top:7px;color:var(--secondary-text-color);font-size:12px}.timeline-location ha-icon{--mdc-icon-size:15px}.timeline-provider{margin-top:6px;font-size:11px;color:var(--secondary-text-color)}.no-events{display:flex;align-items:center;justify-content:center;gap:9px;padding:30px;color:var(--secondary-text-color)}
      .empty{padding:24px 12px 28px;display:flex;justify-content:center;gap:14px;color:var(--secondary-text-color)}.empty strong,.empty span{display:block}.empty strong{color:var(--primary-text-color)}@keyframes spin{to{transform:rotate(360deg)}}
      @media(max-width:520px){.modal-backdrop{padding:0;place-items:end center}.detail-modal{max-height:94vh;border-radius:22px 22px 0 0}.detail-modal header{padding:13px 12px}.detail-status{max-width:34%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.detail-content{padding:14px;max-height:calc(94vh - 68px)}.detail-actions{flex-direction:column}.timeline-head{display:block}.timeline-head time{display:block;margin-top:4px}.header{padding:16px 14px 12px}.summary{grid-template-columns:repeat(2,1fr)}.content{padding:8px}.package{padding:14px}.info-grid,.progress-row,.event{margin-left:0}.chip{max-width:38%;padding:5px 7px}}
    </style><ha-card><div class="header"><div class="header-top"><div class="brand"><div class="brand-icon"><ha-icon icon="mdi:package-variant-closed"></ha-icon></div><div><div class="title">${this._escape(this._config.title || "PaketHub")}</div><div class="version">Dashboard v${CARD_VERSION}</div></div></div><button class="refresh ${this._refreshing ? "refreshing" : ""}" ${this._refreshing ? "disabled" : ""}><ha-icon icon="mdi:refresh"></ha-icon></button></div>
      <div class="summary"><div class="summary-item"><span class="summary-value">${summary.active}</span><span class="summary-label">${this._escape(this._t("active"))}</span></div><div class="summary-item"><span class="summary-value">${summary.transit + summary.delivery}</span><span class="summary-label">${this._escape(this._t("packages_transit"))}</span></div><div class="summary-item"><span class="summary-value">${summary.delivered}</span><span class="summary-label">${this._escape(this._t("delivered"))}</span></div><div class="summary-item"><span class="summary-value">${summary.error}</span><span class="summary-label">${this._escape(this._t("problems"))}</span></div></div><div class="last-sync">${this._escape(this._relative(this._lastSync()?.state))}</div></div><div class="content">${body}</div></ha-card>`;
    this.shadowRoot.querySelector(".refresh")?.addEventListener("click", () => this._refresh());
    this.shadowRoot.querySelectorAll(".copy-inline").forEach(el => el.addEventListener("click", async event => {
      event.stopPropagation();
      const item = packages[Number(el.dataset.copy)];
      try { await navigator.clipboard.writeText(item?.tracking_number || ""); el.innerHTML = '<ha-icon icon="mdi:check"></ha-icon>'; setTimeout(() => { el.innerHTML = '<ha-icon icon="mdi:content-copy"></ha-icon>'; }, 1200); }
      catch (err) { console.warn("PaketHub: Could not copy tracking number", err); }
    }));
    this.shadowRoot.querySelectorAll(".package").forEach(el => {
      el.addEventListener("click", () => this._open(packages[Number(el.dataset.index)]));
      el.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); this._open(packages[Number(el.dataset.index)]); } });
    });
  }
}

class PaketHubCardEditor extends HTMLElement {
  constructor(){super();this.attachShadow({mode:"open"})} set hass(h){this._hass=h}
  setConfig(c){this._config={title:"PaketHub",show_delivered:false,max_packages:8,sort_by:"status",tap_action:"details",...c};this._render()}
  _changed(k,v){this._config={...this._config,[k]:v};this.dispatchEvent(new CustomEvent("config-changed",{bubbles:true,composed:true,detail:{config:this._config}}))}
  _render(){if(!this._config)return;this.shadowRoot.innerHTML=`<style>.form{display:grid;gap:16px;padding:8px 0}label{display:grid;gap:6px;color:var(--primary-text-color);font-size:14px}input,select{box-sizing:border-box;width:100%;min-height:42px;padding:8px 10px;border:1px solid var(--divider-color);border-radius:10px;color:var(--primary-text-color);background:var(--card-background-color);font:inherit}.check{display:flex;align-items:center;gap:10px}.check input{width:auto;min-height:auto}</style><div class="form"><label>Titel<input id="title" value="${String(this._config.title||"").replaceAll('"','&quot;')}"></label><label>Maximale Anzahl<input id="max" type="number" min="1" max="50" value="${Number(this._config.max_packages)||8}"></label><label>Sortierung<select id="sort"><option value="status" ${this._config.sort_by==="status"?"selected":""}>Status</option><option value="eta" ${this._config.sort_by==="eta"?"selected":""}>Zustelltermin</option><option value="name" ${this._config.sort_by==="name"?"selected":""}>Name</option></select></label><label>Aktion beim Antippen<select id="tap"><option value="details" ${this._config.tap_action==="details"?"selected":""}>PaketHub-Detailansicht</option><option value="url" ${this._config.tap_action==="url"?"selected":""}>17TRACK öffnen</option><option value="more-info" ${this._config.tap_action==="more-info"?"selected":""}>Home-Assistant-Details</option></select></label><label class="check"><input id="delivered" type="checkbox" ${this._config.show_delivered?"checked":""}>Zugestellte Pakete anzeigen</label></div>`;this.shadowRoot.getElementById("title").addEventListener("change",e=>this._changed("title",e.target.value));this.shadowRoot.getElementById("max").addEventListener("change",e=>this._changed("max_packages",Number(e.target.value)));this.shadowRoot.getElementById("sort").addEventListener("change",e=>this._changed("sort_by",e.target.value));this.shadowRoot.getElementById("tap").addEventListener("change",e=>this._changed("tap_action",e.target.value));this.shadowRoot.getElementById("delivered").addEventListener("change",e=>this._changed("show_delivered",e.target.checked))}
}

if(!customElements.get("pakethub-card"))customElements.define("pakethub-card",PaketHubCard);
if(!customElements.get("pakethub-card-editor"))customElements.define("pakethub-card-editor",PaketHubCardEditor);
window.customCards=window.customCards||[];
if(!window.customCards.some(c=>c.type==="pakethub-card"))window.customCards.push({type:"pakethub-card",name:"PaketHub Card",description:"Parcel overview with ETA, carrier badges and tracking timeline",preview:true});
console.info(`%c PAKETHUB-CARD %c v${CARD_VERSION} `,"color:white;background:#334155;font-weight:700;padding:2px 5px","color:white;background:#0ea5e9;font-weight:700;padding:2px 5px");
