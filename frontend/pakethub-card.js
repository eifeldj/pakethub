const CARD_VERSION = "2.1.1";

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
  { match: /austrian post|österreichische post|post at|post\.at/i, key: "postat", short: "Post", name: "Austrian Post", bg: "#17191d", fg: "#ffd400", accent: "#ffd400", showName: true },
  { match: /dhl/i, key: "dhl", short: "DHL", name: "DHL", bg: "#ffcc00", fg: "#d40511", accent: "#d40511", showName: false },
  { match: /ups/i, key: "ups", short: "UPS", name: "UPS", bg: "#351c15", fg: "#ffb500", accent: "#8a5a34", showName: false },
  { match: /fedex/i, key: "fedex", short: "FedEx", name: "FedEx", bg: "#ffffff", fg: "#4d148c", accent: "#4d148c", showName: false },
  { match: /gls/i, key: "gls", short: "GLS", name: "GLS", bg: "#061ab1", fg: "#ffdf00", accent: "#061ab1", showName: false },
  { match: /dpd/i, key: "dpd", short: "DPD", name: "DPD", bg: "#ffffff", fg: "#dc0032", accent: "#dc0032", showName: false },
  { match: /amazon/i, key: "amazon", short: "amazon", name: "Amazon Logistics", bg: "#131a22", fg: "#ff9900", accent: "#146eb4", showName: true },
  { match: /yunexpress|yun express/i, key: "yun", short: "YunExpress", name: "YunExpress", bg: "#162126", fg: "#00a2b8", accent: "#00a2b8", showName: false },
  { match: /hermes|evri/i, key: "hermes", short: "Hermes", name: "Hermes / Evri", bg: "#ffffff", fg: "#0091cd", accent: "#0091cd", showName: false },
  { match: /royal mail/i, key: "royalmail", short: "Royal Mail", name: "Royal Mail", bg: "#e4002b", fg: "#ffffff", accent: "#e4002b", showName: false },
  { match: /usps|united states postal/i, key: "usps", short: "USPS", name: "USPS", bg: "#ffffff", fg: "#004b87", accent: "#004b87", showName: false },
];

const TEXT = {
  de: {
    not_found:"Nicht gefunden", announced:"Angekündigt", transit:"Unterwegs", expired:"Abgelaufen", pickup:"Abholbereit", out:"In Zustellung", failed:"Zustellung fehlgeschlagen", delivered:"Zugestellt", exception:"Ausnahme", unknown:"Unbekannt",
    today:"Heute", tomorrow:"Morgen", overdue:"Termin überschritten", no_eta:"Keine ETA", eta:"ETA", active:"Aktiv", problems:"Probleme", packages_transit:"Unterwegs", no_active:"Keine aktiven Pakete", no_shipments:"Es sind noch keine Sendungen vorhanden.", delivered_hidden:"Zugestellte Pakete sind ausgeblendet.",
    just_now:"gerade eben aktualisiert", minute:"Minute", minutes:"Minuten", hour:"Stunde", hours:"Stunden", day:"Tag", days:"Tagen", not_synced:"Noch nicht synchronisiert",
    details:"Paketdetails", carrier_unknown:"Paketdienst unbekannt", tracking_number:"Trackingnummer", unavailable:"Nicht verfügbar", copy:"Trackingnummer kopieren", open_17:"Bei 17TRACK öffnen", ha_details:"Home-Assistant-Details", history:"Sendungsverlauf", no_events:"Noch keine Tracking-Ereignisse vorhanden.", status_update:"Statusaktualisierung", time_unknown:"Zeit unbekannt", close:"Schließen", copied:"Trackingnummer kopiert", refresh:"Sendungen aktualisieren", add:"Sendung hinzufügen", search:"Pakete durchsuchen", favorites:"Favoriten", all:"Alle", active_filter:"Aktiv", transit_filter:"Unterwegs", delivered_filter:"Zugestellt", problems_filter:"Probleme", rename:"Umbenennen", remove:"Löschen", save:"Speichern", cancel:"Abbrechen", package_name:"Paketname", carrier_code:"Carrier-Code (optional)", confirm_remove:"Diese Sendung wirklich dauerhaft löschen?", expand:"Verlauf aufklappen", collapse:"Verlauf zuklappen"
  },
  en: {
    not_found:"Not found", announced:"Info received", transit:"In transit", expired:"Expired", pickup:"Ready for pickup", out:"Out for delivery", failed:"Delivery failed", delivered:"Delivered", exception:"Exception", unknown:"Unknown",
    today:"Today", tomorrow:"Tomorrow", overdue:"ETA overdue", no_eta:"No ETA", eta:"ETA", active:"Active", problems:"Problems", packages_transit:"In transit", no_active:"No active packages", no_shipments:"No shipments are available yet.", delivered_hidden:"Delivered packages are hidden.",
    just_now:"updated just now", minute:"minute", minutes:"minutes", hour:"hour", hours:"hours", day:"day", days:"days", not_synced:"Not synchronized yet",
    details:"Package details", carrier_unknown:"Unknown carrier", tracking_number:"Tracking number", unavailable:"Unavailable", copy:"Copy tracking number", open_17:"Open in 17TRACK", ha_details:"Home Assistant details", history:"Tracking history", no_events:"No tracking events available yet.", status_update:"Tracking update", time_unknown:"Time unknown", close:"Close", copied:"Tracking number copied", refresh:"Refresh shipments", add:"Add shipment", search:"Search shipments", favorites:"Favorites", all:"All", active_filter:"Active", transit_filter:"In transit", delivered_filter:"Delivered", problems_filter:"Problems", rename:"Rename", remove:"Delete", save:"Save", cancel:"Cancel", package_name:"Package name", carrier_code:"Carrier code (optional)", confirm_remove:"Permanently delete this shipment?", expand:"Expand history", collapse:"Collapse history"
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
    this._lastFocusedElement = null;
    this._query = "";
    this._favoritesOnly = false;
    this._statusFilter = "active";
    this._expanded = new Set();
  }

  connectedCallback() { this._timer ||= setInterval(() => this._updateClock(), 30000); }
  disconnectedCallback() { clearInterval(this._timer); this._timer = undefined; this._closeDetail(false); }

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


  _favoriteKey() { return "pakethub:favorites"; }
  _favorites() { try { return new Set(JSON.parse(localStorage.getItem(this._favoriteKey()) || "[]")); } catch { return new Set(); } }
  _toggleFavorite(number) { const fav=this._favorites(); fav.has(number)?fav.delete(number):fav.add(number); localStorage.setItem(this._favoriteKey(),JSON.stringify([...fav])); this._signature=""; this._render(); }

  _allPackages() {
    if (!this._hass) return [];
    return Object.entries(this._hass.states)
      .filter(([id, state]) => id.startsWith("sensor.") && state.attributes?.pakethub_card === true)
      .map(([entityId, state]) => ({ entityId, state: state.state, ...state.attributes }));
  }

  _packages() {
    let list = this._allPackages();
    const favorites = this._favorites();
    const filter = this._statusFilter || (this._config.show_delivered ? "all" : "active");
    if (filter === "active") list = list.filter(p => p.raw_status !== "Delivered");
    else if (filter === "transit") list = list.filter(p => ["InTransit","OutForDelivery","AvailableForPickup","InfoReceived"].includes(p.raw_status));
    else if (filter === "delivered") list = list.filter(p => p.raw_status === "Delivered");
    else if (filter === "problems") list = list.filter(p => ["DeliveryFailure","Exception","Expired","NotFound"].includes(p.raw_status));
    if (this._favoritesOnly) list=list.filter(p => favorites.has(String(p.tracking_number||"")));
    const priority = { DeliveryFailure:0, Exception:0, OutForDelivery:1, AvailableForPickup:1, InTransit:2, InfoReceived:3, Unknown:4, NotFound:4, Expired:5, Delivered:6 };
    if (this._config.sort_by === "eta") list.sort((a,b) => (a.eta || "9999").localeCompare(b.eta || "9999"));
    else if (this._config.sort_by === "name") list.sort((a,b) => (a.package_name || "").localeCompare(b.package_name || "", undefined, { sensitivity:"base" }));
    else list.sort((a,b) => (priority[a.raw_status] ?? 9) - (priority[b.raw_status] ?? 9));
    list.sort((a,b) => Number(favorites.has(String(b.tracking_number||""))) - Number(favorites.has(String(a.tracking_number||""))));
    return list.slice(0, Math.max(1, Number(this._config.max_packages) || 8));
  }

  _applySearchFilter() {
    const query = String(this._query || "").trim().toLocaleLowerCase();
    const cards = [...(this.shadowRoot?.querySelectorAll(".package") || [])];
    let visible = 0;
    for (const card of cards) {
      const matches = !query || String(card.dataset.search || "").includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    }
    const empty = this.shadowRoot?.querySelector(".search-empty");
    if (empty) empty.hidden = visible !== 0 || cards.length === 0;
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
    return CARRIER_META.find(item => item.match.test(carrier)) || {key:"generic", short:(carrier.trim() || "Carrier"), name:(carrier.trim() || this._t("carrier_unknown")), bg:"var(--secondary-background-color)", fg:"var(--primary-text-color)", accent:"var(--primary-color)", showName:true};
  }

  _carrierLogo(meta) {
    const label = this._escape(meta.short || meta.name || "Carrier");
    const logos = {
      postat: `<svg viewBox="0 0 180 72" role="img" aria-label="Austrian Post"><g fill="currentColor"><path d="M12 17h24l-8 11 9 0c9 0 16 7 16 16s-7 16-16 16-16-7-16-16c0-2 .3-4 1-6L12 17zm25 18a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"/><path d="M23 17h19l-7 10H29z"/><text x="64" y="50" font-size="34" font-weight="800" font-family="Arial,Helvetica,sans-serif">Post</text></g></svg>`,
      dhl: `<svg viewBox="0 0 180 64" role="img" aria-label="DHL"><g fill="currentColor"><path d="M8 20h45l-4 6H4zM5 30h42l-4 6H1zM4 40h38l-4 6H0z"/><text x="55" y="47" font-size="42" font-weight="900" font-style="italic" font-family="Arial,Helvetica,sans-serif">DHL</text></g></svg>`,
      ups: `<svg viewBox="0 0 130 90" role="img" aria-label="UPS"><path fill="currentColor" d="M25 8h80v43c0 20-15 30-40 36-25-6-40-16-40-36V8z"/><text x="65" y="59" text-anchor="middle" fill="#351c15" font-size="30" font-weight="900" font-family="Arial,Helvetica,sans-serif">UPS</text></svg>`,
      fedex: `<svg viewBox="0 0 190 65" role="img" aria-label="FedEx"><text x="5" y="48" font-size="48" font-weight="900" font-family="Arial,Helvetica,sans-serif"><tspan fill="#4d148c">Fed</tspan><tspan fill="#ff6600">Ex</tspan></text></svg>`,
      gls: `<svg viewBox="0 0 180 70" role="img" aria-label="GLS"><circle cx="35" cy="35" r="23" fill="none" stroke="currentColor" stroke-width="10"/><path d="M35 12v23h22" fill="none" stroke="currentColor" stroke-width="10"/><text x="72" y="49" fill="currentColor" font-size="42" font-weight="900" font-family="Arial,Helvetica,sans-serif">GLS</text></svg>`,
      dpd: `<svg viewBox="0 0 180 72" role="img" aria-label="DPD"><path fill="currentColor" d="M16 18l24-12 24 12-24 13-24-13zm0 7l21 11v25L16 49V25zm48 0v24L43 61V36l21-11z"/><text x="76" y="50" fill="currentColor" font-size="40" font-weight="800" font-family="Arial,Helvetica,sans-serif">dpd</text></svg>`,
      amazon: `<svg viewBox="0 0 190 72" role="img" aria-label="Amazon Logistics"><text x="8" y="43" fill="#fff" font-size="36" font-weight="700" font-family="Arial,Helvetica,sans-serif">amazon</text><path d="M32 53c36 17 78 14 116-2" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M143 48l10 2-6 8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      yun: `<svg viewBox="0 0 190 82" role="img" aria-label="YunExpress"><path d="M17 35c5-15 21-20 33-12 8-15 32-12 36 5 13-2 24 7 24 19 0 13-10 20-23 20H30c-17 0-23-20-13-32z" fill="none" stroke="currentColor" stroke-width="7"/><path d="M36 45l14 9 12-20 13 25 16-14" fill="none" stroke="#f5a000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><text x="105" y="56" fill="currentColor" font-size="25" font-weight="800" font-style="italic" font-family="Arial,Helvetica,sans-serif">YunExpress</text></svg>`,
      hermes: `<svg viewBox="0 0 185 68" role="img" aria-label="Hermes"><text x="8" y="48" fill="currentColor" font-size="43" font-weight="800" font-family="Arial,Helvetica,sans-serif">HERMES</text></svg>`,
      royalmail: `<svg viewBox="0 0 190 72" role="img" aria-label="Royal Mail"><path d="M15 42h44l10-20h35l12 20h19" fill="none" stroke="#ffdf00" stroke-width="7"/><text x="12" y="66" fill="currentColor" font-size="25" font-weight="800" font-family="Arial,Helvetica,sans-serif">Royal Mail</text></svg>`,
      usps: `<svg viewBox="0 0 180 72" role="img" aria-label="USPS"><path d="M8 18h74l-16 10H13zM13 34h48L46 45H18z" fill="currentColor"/><text x="83" y="48" fill="currentColor" font-size="38" font-weight="900" font-style="italic" font-family="Arial,Helvetica,sans-serif">USPS</text></svg>`,
    };
    return logos[meta.key] || `<div class="generic-logo"><ha-icon icon="mdi:truck-fast-outline" aria-hidden="true"></ha-icon><strong>${label}</strong></div>`;
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


  _openManage(mode, item = {}) {
    this._closeDetail(false);
    const isAdd = mode === "add";
    const title = isAdd ? this._t("add") : this._t("rename");
    const template=document.createElement("template");
    template.innerHTML=`<div class="modal-backdrop manage-backdrop"><section class="manage-modal" role="dialog" aria-modal="true" tabindex="-1"><header><strong>${this._escape(title)}</strong><button class="icon-button" data-action="close"><ha-icon icon="mdi:close"></ha-icon></button></header><form><label>${this._escape(this._t("package_name"))}<input name="package_name" maxlength="100" required value="${this._escape(item.package_name||"")}"></label><label>${this._escape(this._t("tracking_number"))}<input name="tracking_number" required ${isAdd?"":"readonly"} value="${this._escape(item.tracking_number||"")}"></label>${isAdd?`<label>${this._escape(this._t("carrier_code"))}<input name="carrier" inputmode="numeric"></label>`:""}<div class="form-actions"><button type="button" data-action="close">${this._escape(this._t("cancel"))}</button><button class="primary" type="submit">${this._escape(this._t("save"))}</button></div><div class="form-message" aria-live="polite"></div></form></section></div>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    const back=this.shadowRoot.querySelector(".manage-backdrop"), form=back.querySelector("form"), msg=back.querySelector(".form-message");
    back.querySelectorAll('[data-action="close"]').forEach(b=>b.addEventListener("click",()=>this._closeDetail()));
    form.addEventListener("submit", async e=>{ e.preventDefault(); const fd=new FormData(form); const data={tracking_number:String(fd.get("tracking_number")||"").trim(),package_name:String(fd.get("package_name")||"").trim()}; const carrier=String(fd.get("carrier")||"").trim(); if(carrier)data.carrier=Number(carrier); msg.textContent="…"; try { await this._hass.callService("pakethub",isAdd?"add_package":"rename_package",data); msg.textContent="✓"; await this._refresh(); setTimeout(()=>this._closeDetail(),500); } catch(err){ msg.textContent=err?.message||String(err); }});
    requestAnimationFrame(()=>form.querySelector('input[name="package_name"]')?.focus());
  }

  async _remove(item) {
    if (!confirm(this._t("confirm_remove"))) return;
    try { await this._hass.callService("pakethub","remove_package",{tracking_number:item.tracking_number,...(item.carrier_code?{carrier:Number(item.carrier_code)}:{})}); await this._refresh(); }
    catch(err){ console.error("PaketHub remove failed",err); }
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
    this._closeDetail(false);
    const timeline = Array.isArray(item.timeline) ? item.timeline : (Array.isArray(item.history) ? item.history : []);
    const meta = this._statusMeta(item.raw_status);
    const events = timeline.length ? timeline.map((event,index) => {
      const description = event?.description || this._t("status_update");
      const location = event?.location ? `<div class="timeline-location"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${this._escape(event.location)}</div>` : "";
      const provider = event?.provider ? `<span>${this._escape(event.provider)}</span>` : "";
      return `<div class="timeline-event ${index === 0 ? "current" : ""}"><div class="timeline-marker" aria-hidden="true"><i></i></div><div class="timeline-card"><div class="timeline-head"><strong>${this._escape(description)}</strong><time>${this._escape(this._formatDate(event?.time))}</time></div>${location}<div class="timeline-provider">${provider}</div></div></div>`;
    }).join("") : `<div class="no-events"><ha-icon icon="mdi:timeline-clock-outline" aria-hidden="true"></ha-icon><span>${this._escape(this._t("no_events"))}</span></div>`;
    const number = this._escape(item.tracking_number || "");
    const titleId = `pakethub-dialog-title-${Date.now()}`;
    const historyId = `${titleId}-history`;
    const urlButton = item.tracking_url ? `<button type="button" class="detail-action primary" data-action="track"><ha-icon icon="mdi:open-in-new" aria-hidden="true"></ha-icon>${this._escape(this._t("open_17"))}</button>` : "";
    const template = document.createElement("template");
    template.innerHTML = `<div class="modal-backdrop"><section class="detail-modal ${meta.cls}" role="dialog" aria-modal="true" aria-labelledby="${titleId}" aria-describedby="${historyId}" tabindex="-1"><header><button type="button" class="icon-button" data-action="close" aria-label="${this._escape(this._t("close"))}"><ha-icon icon="mdi:arrow-left" aria-hidden="true"></ha-icon></button><div class="detail-title"><strong id="${titleId}">${this._escape(item.package_name || item.tracking_number || "Paket")}</strong><span>${this._escape(item.carrier || this._t("carrier_unknown"))}</span></div><div class="detail-status"><ha-icon icon="${meta.icon}" aria-hidden="true"></ha-icon>${this._escape(meta.label)}</div></header><div class="detail-content"><div class="tracking-box"><div><span>${this._escape(this._t("tracking_number"))}</span><strong>${number || this._t("unavailable")}</strong></div>${number ? `<button type="button" class="icon-button" data-action="copy" aria-label="${this._escape(this._t("copy"))}"><ha-icon icon="mdi:content-copy" aria-hidden="true"></ha-icon></button>` : ""}</div><div class="detail-actions">${urlButton}<button type="button" class="detail-action" data-action="more"><ha-icon icon="mdi:information-outline" aria-hidden="true"></ha-icon>${this._escape(this._t("ha_details"))}</button></div><h3 id="${historyId}">${this._escape(this._t("history"))}</h3><div class="timeline">${events}</div><div class="sr-only" aria-live="polite" data-live></div></div></section></div>`;
    this._lastFocusedElement = this.shadowRoot.activeElement || document.activeElement;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    const backdrop = this.shadowRoot.querySelector(".modal-backdrop");
    const dialog = backdrop?.querySelector(".detail-modal");
    backdrop?.addEventListener("click", event => { if (event.target === backdrop) this._closeDetail(); });
    backdrop?.querySelector('[data-action="close"]')?.addEventListener("click", () => this._closeDetail());
    backdrop?.querySelector('[data-action="copy"]')?.addEventListener("click", async event => {
      try { await navigator.clipboard.writeText(item.tracking_number || ""); event.currentTarget.innerHTML = '<ha-icon icon="mdi:check" aria-hidden="true"></ha-icon>'; const live=backdrop.querySelector('[data-live]'); if(live) live.textContent=this._t("copied"); }
      catch (err) { console.warn("PaketHub: Could not copy tracking number", err); }
    });
    backdrop?.querySelector('[data-action="track"]')?.addEventListener("click", () => window.open(item.tracking_url, "_blank", "noopener,noreferrer"));
    backdrop?.querySelector('[data-action="more"]')?.addEventListener("click", () => { this._closeDetail(); this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles:true, composed:true, detail:{ entityId:item.entityId } })); });
    this._escapeHandler = event => {
      if (event.key === "Escape") { event.preventDefault(); this._closeDetail(); return; }
      if (event.key === "Tab" && dialog) {
        const focusable = [...dialog.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
        if (!focusable.length) { event.preventDefault(); dialog.focus(); return; }
        const first=focusable[0], last=focusable[focusable.length-1];
        if (event.shiftKey && this.shadowRoot.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && this.shadowRoot.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", this._escapeHandler);
    requestAnimationFrame(() => backdrop?.querySelector('[data-action="close"]')?.focus());
  }

  _closeDetail(restoreFocus = true) {
    this.shadowRoot?.querySelector(".modal-backdrop")?.remove();
    if (this._escapeHandler) window.removeEventListener("keydown", this._escapeHandler);
    this._escapeHandler = undefined;
    if (restoreFocus && this._lastFocusedElement?.focus) this._lastFocusedElement.focus();
    this._lastFocusedElement = null;
    this._query = "";
    this._favoritesOnly = false;
    this._statusFilter = "active";
    this._expanded = new Set();
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
      const location = item.location ? `<div class="info-block location-block"><span>${this._escape(this._lang() === "de" ? "Standort" : "Location")}</span><strong><ha-icon icon="mdi:map-marker-outline"></ha-icon>${this._escape(item.location)}</strong></div>` : "";
      const eventTime = item.latest_event_time || item.last_event_time || item.updated_at || item.last_update || this._lastSync()?.state;
      const event = item.latest_event ? `<div class="event">${this._escape(item.latest_event)}</div><div class="event-time"><ha-icon icon="mdi:clock-outline"></ha-icon>${this._escape(this._relative(eventTime))}</div>` : "";
      const copy = number ? `<button class="copy-inline" data-copy="${index}" type="button" aria-label="${this._escape(this._t("copy"))}" title="${this._escape(this._t("copy"))}"><ha-icon icon="mdi:content-copy"></ha-icon></button>` : "";
      const isFav=this._favorites().has(number);
      const expanded=this._expanded.has(number);
      const timeline=Array.isArray(item.timeline)?item.timeline:[];
      const inlineTimeline=expanded?`<div class="inline-details"><div class="inline-actions"><button data-action="favorite" data-index="${index}"><ha-icon icon="mdi:star${isFav?"":"-outline"}"></ha-icon>${this._escape(this._t("favorites"))}</button><button data-action="rename" data-index="${index}"><ha-icon icon="mdi:pencil-outline"></ha-icon>${this._escape(this._t("rename"))}</button><button class="danger" data-action="remove" data-index="${index}"><ha-icon icon="mdi:delete-outline"></ha-icon>${this._escape(this._t("remove"))}</button></div><div class="inline-timeline">${timeline.length?timeline.map((ev,i)=>`<div class="inline-event"><i></i><div><strong>${this._escape(ev.description||this._t("status_update"))}</strong><span>${this._escape(this._formatDate(ev.time))}${ev.location?` · ${this._escape(ev.location)}`:""}</span></div></div>`).join(""):`<div class="no-events">${this._escape(this._t("no_events"))}</div>`}</div></div>`:"";
      return `<article class="package ${meta.cls} ${expanded?"expanded":""}" data-index="${index}" data-search="${this._escape(`${item.package_name||""} ${item.tracking_number||""} ${item.carrier||""} ${item.latest_event||""}`.toLocaleLowerCase())}" tabindex="0" role="button" aria-expanded="${expanded}" aria-label="${this._escape(item.package_name || item.tracking_number || "Package")}: ${this._escape(meta.label)}">
        <aside class="carrier-brand" style="--carrier-bg:${carrierMeta.bg};--carrier-fg:${carrierMeta.fg};--carrier-accent:${carrierMeta.accent || carrierMeta.fg}" title="${this._escape(item.carrier || this._t("carrier_unknown"))}">
          <div class="carrier-mark">${this._carrierLogo(carrierMeta)}</div>${carrierMeta.showName === false ? "" : `<span>${this._escape(carrierMeta.name || item.carrier || this._t("carrier_unknown"))}</span>`}
        </aside>
        <div class="package-main" style="--carrier-accent:${carrierMeta.accent || carrierMeta.fg}">
          <div class="topline"><div class="heading"><div class="name-row"><button class="favorite-inline" data-action="favorite" data-index="${index}" aria-label="${this._escape(this._t("favorites"))}"><ha-icon icon="mdi:star${isFav?"":"-outline"}"></ha-icon></button><div class="name">${this._escape(item.package_name || item.tracking_number || "Package")}</div><div class="tracking-tools">${suffix}${copy}</div></div><div class="carrier">${this._escape(item.carrier || this._t("carrier_unknown"))}</div></div><div class="chip"><i></i>${this._escape(meta.label)}</div></div>
          <div class="progress-row"><div class="progress"><div style="width:${progress}%"></div></div><div class="percent">${progress}%</div><ha-icon class="chevron" icon="mdi:chevron-${expanded?"up":"down"}" aria-hidden="true"></ha-icon></div>
          <div class="info-grid"><div class="info-block eta-block"><span>${this._escape(this._t("eta"))}</span><strong><ha-icon icon="mdi:calendar-clock-outline"></ha-icon>${this._escape(this._eta(item))}</strong></div>${location}</div>${event}${inlineTimeline}
        </div>
      </article>`;
    }).join("") : `<div class="empty"><ha-icon icon="mdi:package-variant"></ha-icon><div><strong>${this._escape(this._t("no_active"))}</strong><span>${this._escape(this._config.show_delivered ? this._t("no_shipments") : this._t("delivered_hidden"))}</span></div></div>`;

    this.shadowRoot.innerHTML = `<style>
      :host{display:block} ha-card{overflow:hidden}.header{padding:18px 20px 14px;border-bottom:1px solid var(--divider-color)}
      .header-top{display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:10px}.brand-icon{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--primary-color) 16%,transparent);color:var(--primary-color)}
      .title{font-size:20px;font-weight:700}.version{font-size:11px;color:var(--secondary-text-color);margin-top:2px}.refresh{width:40px;height:40px;border:0;border-radius:50%;display:grid;place-items:center;background:transparent;color:var(--primary-text-color);cursor:pointer}.refresh:hover{background:var(--secondary-background-color)}.refreshing ha-icon{animation:spin .8s linear infinite}
      .summary{margin-top:14px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.summary-item{padding:9px 8px;border-radius:12px;background:var(--secondary-background-color);text-align:center}.summary-value{display:block;font-size:17px;font-weight:700}.summary-label{display:block;font-size:11px;color:var(--secondary-text-color)}.last-sync{margin-top:10px;font-size:12px;color:var(--secondary-text-color)}
      [hidden]{display:none!important}.content{padding:18px;display:grid;gap:14px;container-type:inline-size}.package{--status-color:var(--primary-color);width:100%;border:1px solid color-mix(in srgb,var(--divider-color) 76%,transparent);border-radius:20px;padding:0;text-align:left;cursor:pointer;color:var(--primary-text-color);background:linear-gradient(110deg,color-mix(in srgb,var(--card-background-color) 94%,var(--status-color) 6%),color-mix(in srgb,var(--card-background-color) 98%,#000 2%));font:inherit;display:grid;grid-template-columns:150px minmax(0,1fr);overflow:hidden;transition:transform .18s,box-shadow .18s,border-color .18s}.package:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(0,0,0,.12)}.package:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}
      .transit{--status-color:var(--warning-color,#ff9800)}.delivery{--status-color:var(--info-color,#039be5)}.delivered{--status-color:var(--success-color,#43a047)}.error{--status-color:var(--error-color,#db4437)}.muted,.info{--status-color:var(--secondary-text-color)}
      .carrier-brand{min-height:210px;padding:24px 16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:var(--carrier-bg);color:var(--carrier-fg);border-right:1px solid color-mix(in srgb,var(--divider-color) 82%,transparent);box-sizing:border-box}.carrier-mark{width:100%;height:82px;display:grid;place-items:center}.carrier-mark svg{display:block;width:100%;height:100%;max-width:142px;overflow:visible}.carrier-brand>span{font-size:13px;margin-top:2px;font-weight:650;text-align:center;color:color-mix(in srgb,var(--carrier-fg) 82%,var(--primary-text-color) 18%)}.generic-logo{display:grid;place-items:center;gap:8px;text-align:center}.generic-logo ha-icon{--mdc-icon-size:36px}.generic-logo strong{font-size:15px;overflow-wrap:anywhere}.package-main{min-width:0;padding:25px 30px 24px;background:linear-gradient(115deg,color-mix(in srgb,var(--carrier-accent) 5%,transparent),transparent 48%)}.topline{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:14px}.heading{min-width:0}.name-row{display:flex;align-items:flex-start;gap:9px;min-width:0}.name{font-size:21px;font-weight:700;line-height:1.22;white-space:normal;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-width:0;max-height:2.44em}.tracking-tools{display:flex;align-items:center;gap:4px;flex:0 0 auto;padding-top:1px}.suffix{font-size:13px;color:var(--secondary-text-color);white-space:nowrap}.copy-inline{width:32px;height:32px;border:0;border-radius:9px;display:grid;place-items:center;background:transparent;color:var(--secondary-text-color);cursor:pointer;flex:0 0 auto}.copy-inline:hover{background:var(--secondary-background-color);color:var(--primary-text-color)}.copy-inline ha-icon{--mdc-icon-size:18px}.carrier{margin-top:7px;font-size:14px;color:var(--secondary-text-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .chip{max-width:42%;display:flex;align-items:center;gap:6px;padding:6px 9px;border-radius:999px;color:var(--status-color);background:color-mix(in srgb,var(--status-color) 14%,transparent);font-size:11px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chip i{width:7px;height:7px;border-radius:50%;background:currentColor;flex:0 0 auto}
      .progress-row{margin:22px 0 18px;display:flex;align-items:center;gap:14px}.progress{height:9px;flex:1;border-radius:999px;overflow:hidden;background:color-mix(in srgb,var(--divider-color) 76%,transparent)}.progress>div{height:100%;border-radius:inherit;background:var(--status-color);box-shadow:0 0 10px color-mix(in srgb,var(--status-color) 32%,transparent);transition:width .35s}.percent{min-width:40px;text-align:right;font-size:14px;font-weight:750;color:var(--primary-text-color)}.chevron{--mdc-icon-size:25px;color:var(--secondary-text-color);margin-left:4px}.info-grid{display:grid;grid-template-columns:minmax(138px,190px) minmax(150px,220px);align-items:stretch;gap:14px}.info-block{min-width:0;padding:12px 14px;border:1px solid color-mix(in srgb,var(--divider-color) 82%,transparent);border-radius:14px;background:color-mix(in srgb,var(--secondary-background-color) 86%,transparent)}.info-block span{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.7px;color:var(--secondary-text-color);margin-bottom:5px}.info-block strong{display:flex;align-items:center;gap:7px;font-size:14px;line-height:1.35;overflow-wrap:anywhere}.info-block ha-icon{--mdc-icon-size:18px;color:var(--status-color);flex:0 0 auto}.event{margin:17px 42px 0 0;color:var(--secondary-text-color);font-size:14px;line-height:1.5;white-space:normal;overflow:visible}.event-time{margin-top:8px;display:flex;align-items:center;gap:6px;color:var(--secondary-text-color);font-size:11px}.event-time ha-icon{--mdc-icon-size:16px}
      .modal-backdrop{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:18px;background:rgba(0,0,0,.58);backdrop-filter:blur(4px)}.detail-modal{--status-color:var(--primary-color);width:min(760px,100%);max-height:min(88vh,900px);overflow:hidden;border-radius:22px;background:var(--card-background-color);box-shadow:0 24px 80px rgba(0,0,0,.45);color:var(--primary-text-color)}.detail-modal.transit{--status-color:var(--warning-color,#ff9800)}.detail-modal.delivery{--status-color:var(--info-color,#039be5)}.detail-modal.delivered{--status-color:var(--success-color,#43a047)}.detail-modal.error{--status-color:var(--error-color,#db4437)}.detail-modal.muted,.detail-modal.info{--status-color:var(--secondary-text-color)}.detail-modal header{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid var(--divider-color)}.icon-button{width:40px;height:40px;border:0;border-radius:50%;display:grid;place-items:center;background:transparent;color:var(--primary-text-color);cursor:pointer}.icon-button:hover{background:var(--secondary-background-color)}button:focus-visible,.package:focus-visible{outline:3px solid var(--primary-color);outline-offset:2px}.sr-only{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.detail-title{min-width:0;flex:1}.detail-title strong,.detail-title span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.detail-title strong{font-size:18px}.detail-title span{font-size:12px;color:var(--secondary-text-color);margin-top:2px}.detail-status{display:flex;align-items:center;gap:7px;padding:7px 10px;border-radius:999px;color:var(--status-color);background:color-mix(in srgb,var(--status-color) 14%,transparent);font-size:12px;font-weight:700}.detail-status ha-icon{--mdc-icon-size:18px}.detail-content{padding:18px;max-height:calc(88vh - 74px);overflow:auto}.tracking-box{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:15px;background:var(--secondary-background-color)}.tracking-box>div{min-width:0;flex:1}.tracking-box span,.tracking-box strong{display:block}.tracking-box span{font-size:11px;color:var(--secondary-text-color);margin-bottom:4px}.tracking-box strong{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;overflow-wrap:anywhere}.detail-actions{display:flex;gap:10px;margin:12px 0 20px}.detail-action{flex:1;min-height:43px;border:1px solid var(--divider-color);border-radius:12px;padding:9px 12px;display:flex;align-items:center;justify-content:center;gap:7px;background:transparent;color:var(--primary-text-color);font:inherit;font-weight:650;cursor:pointer}.detail-action.primary{border-color:var(--primary-color);background:var(--primary-color);color:var(--text-primary-color,#fff)}.detail-action ha-icon{--mdc-icon-size:19px}.detail-content h3{margin:0 0 14px;font-size:16px}.timeline{position:relative}.timeline-event{display:grid;grid-template-columns:24px 1fr;gap:10px;position:relative;padding-bottom:14px}.timeline-event:not(:last-child):before{content:"";position:absolute;left:11px;top:20px;bottom:-4px;width:2px;background:var(--divider-color)}.timeline-marker{display:grid;place-items:start center;padding-top:7px}.timeline-marker i{width:10px;height:10px;border:3px solid var(--card-background-color);border-radius:50%;background:var(--secondary-text-color);box-shadow:0 0 0 2px var(--divider-color);z-index:1}.timeline-event.current .timeline-marker i{background:var(--status-color);box-shadow:0 0 0 3px color-mix(in srgb,var(--status-color) 25%,transparent)}.timeline-card{padding:12px 14px;border-radius:14px;background:var(--secondary-background-color)}.timeline-event.current .timeline-card{background:color-mix(in srgb,var(--status-color) 12%,var(--secondary-background-color))}.timeline-head{display:flex;gap:12px;justify-content:space-between}.timeline-head strong{font-size:13px;line-height:1.4}.timeline-head time{flex:0 0 auto;font-size:11px;color:var(--secondary-text-color)}.timeline-location{display:flex;align-items:center;gap:5px;margin-top:7px;color:var(--secondary-text-color);font-size:12px}.timeline-location ha-icon{--mdc-icon-size:15px}.timeline-provider{margin-top:6px;font-size:11px;color:var(--secondary-text-color)}.no-events{display:flex;align-items:center;justify-content:center;gap:9px;padding:30px;color:var(--secondary-text-color)}
      .empty{padding:24px 12px 28px;display:flex;justify-content:center;gap:14px;color:var(--secondary-text-color)}.empty strong,.empty span{display:block}.empty strong{color:var(--primary-text-color)}@keyframes spin{to{transform:rotate(360deg)}}
      @container (max-width:760px){.package{grid-template-columns:128px minmax(0,1fr)}.carrier-brand{padding:18px 10px}.carrier-mark{height:64px}.carrier-mark svg{max-width:112px}.carrier-brand>span{font-size:11px}.package-main{padding:20px 22px}.name{font-size:19px}.topline{gap:10px}.chip{padding:6px 9px}.progress-row{margin:18px 0 15px;gap:9px}.info-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.event{margin-right:0}}@container (max-width:560px){.package{grid-template-columns:1fr}.carrier-brand{min-height:auto;padding:12px 15px;flex-direction:row;justify-content:flex-start;border-right:0;border-bottom:1px solid color-mix(in srgb,var(--divider-color) 82%,transparent)}.carrier-mark{width:100px;height:42px;flex:0 0 auto}.carrier-mark svg{max-width:96px}.carrier-brand>span{font-size:12px;text-align:left}.package-main{padding:17px 18px 18px}.topline{grid-template-columns:minmax(0,1fr) auto}.name{font-size:18px;-webkit-line-clamp:2;max-height:2.44em}.chip{max-width:130px}.progress-row{margin:17px 0 13px}.chevron{display:none}.event{margin-top:14px}.info-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@container (max-width:390px){.topline{grid-template-columns:1fr}.chip{justify-self:start;max-width:none}.tracking-tools{align-self:flex-start}.info-grid{grid-template-columns:1fr}.carrier-brand>span{display:none}}@media(max-width:760px){.content{padding:10px}.modal-backdrop{padding:0;place-items:stretch}.detail-modal{width:100%;height:100dvh;max-height:100dvh;border-radius:0}.detail-modal header{padding:13px 12px}.detail-status{max-width:34%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.detail-content{padding:14px;max-height:calc(100dvh - 68px);padding-bottom:max(18px,env(safe-area-inset-bottom))}.detail-actions{flex-direction:column}.timeline-head{display:block}.timeline-head time{display:block;margin-top:4px}.header{padding:16px 14px 12px}.summary{grid-template-columns:repeat(2,1fr)}}
    .header-actions{display:flex;gap:4px}.add-package,.favorites-filter,.inline-actions button,.form-actions button{border:0;background:transparent;color:var(--primary-text-color);font:inherit;cursor:pointer}.add-package{width:44px;height:44px;border-radius:50%;display:grid;place-items:center}.add-package:hover{background:var(--secondary-background-color)}.toolbar{display:flex;gap:10px;margin-top:14px}.search{flex:1;display:flex;align-items:center;gap:8px;padding:0 12px;border-radius:12px;background:var(--secondary-background-color)}.search ha-icon{--mdc-icon-size:19px;color:var(--secondary-text-color)}.search input{width:100%;height:42px;border:0;outline:0;background:transparent;color:var(--primary-text-color);font:inherit}.favorites-filter{display:flex;align-items:center;gap:6px;padding:0 13px;border-radius:12px;background:var(--secondary-background-color)}.favorites-filter.active{color:#ffc107;background:color-mix(in srgb,#ffc107 15%,var(--secondary-background-color))}.filter-row{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}.status-filter,.favorites-filter{min-height:36px;border:0;display:flex;align-items:center;justify-content:center;gap:6px;padding:0 11px;border-radius:999px;background:var(--secondary-background-color);color:var(--secondary-text-color);font:inherit;font-size:12px;font-weight:650;cursor:pointer}.status-filter:hover,.favorites-filter:hover{color:var(--primary-text-color)}.status-filter.active{color:var(--primary-text-color);background:color-mix(in srgb,var(--primary-color) 20%,var(--secondary-background-color));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--primary-color) 45%,transparent)}.status-filter ha-icon,.favorites-filter ha-icon{--mdc-icon-size:17px}.delivered-filter span{min-width:18px;padding:1px 5px;border-radius:999px;background:color-mix(in srgb,var(--success-color,#43a047) 20%,transparent);color:var(--success-color,#43a047);font-size:10px}.delivered-filter.active{color:var(--success-color,#43a047);background:color-mix(in srgb,var(--success-color,#43a047) 16%,var(--secondary-background-color));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--success-color,#43a047) 42%,transparent)}.favorite-inline{border:0;background:transparent;color:#ffc107;padding:0;display:grid;place-items:center;cursor:pointer}.favorite-inline ha-icon{--mdc-icon-size:20px}.package.expanded{grid-template-rows:auto}.inline-details{grid-column:1/-1;margin-top:18px;padding-top:16px;border-top:1px solid var(--divider-color)}.inline-actions{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}.inline-actions button{display:flex;align-items:center;gap:6px;padding:8px 11px;border-radius:10px;background:var(--secondary-background-color)}.inline-actions .danger{color:var(--error-color,#db4437)}.inline-event{position:relative;display:grid;grid-template-columns:18px 1fr;gap:9px;padding-bottom:14px}.inline-event:not(:last-child):before{content:"";position:absolute;left:5px;top:13px;bottom:0;width:2px;background:var(--divider-color)}.inline-event i{width:10px;height:10px;margin-top:5px;border-radius:50%;background:var(--carrier-accent);z-index:1}.inline-event strong,.inline-event span{display:block}.inline-event strong{font-size:13px}.inline-event span{font-size:11px;color:var(--secondary-text-color);margin-top:4px}.manage-modal{width:min(520px,100%);border-radius:20px;background:var(--card-background-color);box-shadow:0 24px 80px rgba(0,0,0,.45)}.manage-modal header{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid var(--divider-color)}.manage-modal form{display:grid;gap:14px;padding:18px}.manage-modal label{display:grid;gap:6px;font-size:12px;color:var(--secondary-text-color)}.manage-modal input{box-sizing:border-box;width:100%;min-height:44px;padding:9px 11px;border:1px solid var(--divider-color);border-radius:11px;background:var(--secondary-background-color);color:var(--primary-text-color);font:inherit}.form-actions{display:flex;justify-content:flex-end;gap:8px}.form-actions button{padding:9px 14px;border-radius:10px;background:var(--secondary-background-color)}.form-actions .primary{background:var(--primary-color);color:var(--text-primary-color,#fff)}.form-message{min-height:18px;color:var(--error-color,#db4437);font-size:12px}@container(max-width:560px){.toolbar{flex-direction:column}.filter-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.status-filter,.favorites-filter{min-height:40px;padding:0 7px}}@container(max-width:390px){.filter-row{grid-template-columns:repeat(2,minmax(0,1fr))}}</style><ha-card><div class="header"><div class="header-top"><div class="brand"><div class="brand-icon"><ha-icon icon="mdi:package-variant-closed"></ha-icon></div><div><div class="title">${this._escape(this._config.title || "PaketHub")}</div><div class="version">Dashboard v${CARD_VERSION}</div></div></div><div class="header-actions"><button type="button" aria-label="${this._escape(this._t("add"))}" class="add-package"><ha-icon icon="mdi:plus"></ha-icon></button><button type="button" aria-label="${this._escape(this._t("refresh"))}" class="refresh ${this._refreshing ? "refreshing" : ""}" ${this._refreshing ? "disabled" : ""}><ha-icon icon="mdi:refresh"></ha-icon></button></div></div>
      <div class="summary"><div class="summary-item"><span class="summary-value">${summary.active}</span><span class="summary-label">${this._escape(this._t("active"))}</span></div><div class="summary-item"><span class="summary-value">${summary.transit + summary.delivery}</span><span class="summary-label">${this._escape(this._t("packages_transit"))}</span></div><div class="summary-item"><span class="summary-value">${summary.delivered}</span><span class="summary-label">${this._escape(this._t("delivered"))}</span></div><div class="summary-item"><span class="summary-value">${summary.error}</span><span class="summary-label">${this._escape(this._t("problems"))}</span></div></div><div class="toolbar"><div class="search"><ha-icon icon="mdi:magnify"></ha-icon><input type="search" placeholder="${this._escape(this._t("search"))}" value="${this._escape(this._query)}"></div></div><div class="filter-row" role="group" aria-label="Statusfilter"><button class="status-filter ${this._statusFilter==="all"?"active":""}" data-filter="all">${this._escape(this._t("all"))}</button><button class="status-filter ${this._statusFilter==="active"?"active":""}" data-filter="active">${this._escape(this._t("active_filter"))}</button><button class="status-filter ${this._statusFilter==="transit"?"active":""}" data-filter="transit">${this._escape(this._t("transit_filter"))}</button><button class="status-filter delivered-filter ${this._statusFilter==="delivered"?"active":""}" data-filter="delivered"><ha-icon icon="mdi:package-variant-closed-check"></ha-icon>${this._escape(this._t("delivered_filter"))}<span>${summary.delivered}</span></button><button class="status-filter ${this._statusFilter==="problems"?"active":""}" data-filter="problems">${this._escape(this._t("problems_filter"))}</button><button class="favorites-filter ${this._favoritesOnly?"active":""}"><ha-icon icon="mdi:star"></ha-icon>${this._escape(this._t("favorites"))}</button></div><div class="last-sync">${this._escape(this._relative(this._lastSync()?.state))}</div></div><div class="content">${body}<div class="empty search-empty" hidden><ha-icon icon="mdi:magnify-close"></ha-icon><div><strong>${this._escape(this._lang() === "de" ? "Keine Treffer" : "No matches")}</strong><span>${this._escape(this._lang() === "de" ? "Passe den Suchbegriff an." : "Try a different search term.")}</span></div></div></div></ha-card>`;
    this.shadowRoot.querySelector(".refresh")?.addEventListener("click", () => this._refresh());
    this.shadowRoot.querySelector(".add-package")?.addEventListener("click", () => this._openManage("add"));
    const search=this.shadowRoot.querySelector(".search input");
    if(search){
      const stop = event => event.stopPropagation();
      ["keydown","keypress","keyup","beforeinput","input","compositionstart","compositionupdate","compositionend"].forEach(type=>search.addEventListener(type,stop));
      search.addEventListener("input",event=>{
        this._query=event.currentTarget.value;
        this._applySearchFilter();
      });
      this._applySearchFilter();
    }
    this.shadowRoot.querySelectorAll(".status-filter").forEach(button=>button.addEventListener("click",()=>{this._statusFilter=button.dataset.filter||"active";this._favoritesOnly=false;this._signature="";this._render();}));
    this.shadowRoot.querySelector(".favorites-filter")?.addEventListener("click",()=>{this._favoritesOnly=!this._favoritesOnly;if(this._favoritesOnly)this._statusFilter="all";this._signature="";this._render();});
    this.shadowRoot.querySelectorAll(".copy-inline").forEach(el => el.addEventListener("click", async event => {
      event.stopPropagation();
      const item = packages[Number(el.dataset.copy)];
      try { await navigator.clipboard.writeText(item?.tracking_number || ""); el.innerHTML = '<ha-icon icon="mdi:check"></ha-icon>'; setTimeout(() => { el.innerHTML = '<ha-icon icon="mdi:content-copy"></ha-icon>'; }, 1200); }
      catch (err) { console.warn("PaketHub: Could not copy tracking number", err); }
    }));
    this.shadowRoot.querySelectorAll('[data-action="favorite"]').forEach(el=>el.addEventListener("click",e=>{e.stopPropagation();const item=packages[Number(el.dataset.index)];this._toggleFavorite(String(item?.tracking_number||""));}));
    this.shadowRoot.querySelectorAll('[data-action="rename"]').forEach(el=>el.addEventListener("click",e=>{e.stopPropagation();this._openManage("rename",packages[Number(el.dataset.index)]);}));
    this.shadowRoot.querySelectorAll('[data-action="remove"]').forEach(el=>el.addEventListener("click",e=>{e.stopPropagation();this._remove(packages[Number(el.dataset.index)]);}));
    this.shadowRoot.querySelectorAll(".package").forEach(el => {
      const toggle=()=>{const item=packages[Number(el.dataset.index)],n=String(item?.tracking_number||"");this._expanded.has(n)?this._expanded.delete(n):this._expanded.add(n);this._signature="";this._render();};
      el.addEventListener("click", e => { if(!e.target.closest("button")) toggle(); });
      el.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle(); } });
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
if(!window.customCards.some(c=>c.type==="pakethub-card"))window.customCards.push({type:"pakethub-card",name:"PaketHub Card",description:"Modern parcel overview with carrier branding, ETA and tracking timeline",preview:true});
console.info(`%c PAKETHUB-CARD %c v${CARD_VERSION} `,"color:white;background:#334155;font-weight:700;padding:2px 5px","color:white;background:#0ea5e9;font-weight:700;padding:2px 5px");
