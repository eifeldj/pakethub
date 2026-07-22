
(() => {
  "use strict";
  const all = (s, r=document) => [...r.querySelectorAll(s)];

  function reveal() {
    const nodes = all(".ph5-reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(n => n.classList.add("show"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          io.unobserve(e.target);
        }
      });
    }, {threshold:.12});
    nodes.forEach(n => io.observe(n));
  }

  async function github() {
    try {
      const [repoRes, relRes] = await Promise.all([
        fetch("https://api.github.com/repos/eifeldj/pakethub"),
        fetch("https://api.github.com/repos/eifeldj/pakethub/releases/latest")
      ]);
      if (repoRes.ok) {
        const repo = await repoRes.json();
        const s = document.getElementById("ph5-stars");
        if (s) s.textContent = new Intl.NumberFormat().format(repo.stargazers_count || 0);
      }
      if (relRes.ok) {
        const rel = await relRes.json();
        const tag = rel.tag_name || rel.name || "Latest";
        const v = document.getElementById("ph5-version");
        const l = document.getElementById("ph5-release-label");
        if (v) v.textContent = tag;
        if (l) l.textContent = `PaketHub ${tag} available`;
      }
    } catch {}
  }

  function filters() {
    all("[data-demo]").forEach(root => {
      const buttons = all("[data-filter]", root);
      const cards = all("[data-state]", root);
      buttons.forEach(btn => btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const f = btn.dataset.filter;
        cards.forEach(card => card.hidden = f !== "all" && card.dataset.state !== f);
      }));
    });
  }

  function timeline() {
    const btn = document.querySelector("[data-run]");
    const steps = all(".ph5-step");
    if (!btn || !steps.length) return;
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      btn.disabled = true;
      steps.forEach(s => s.classList.remove("active","done"));
      steps.forEach((step, i) => setTimeout(() => {
        if (i > 0) {
          steps[i-1].classList.remove("active");
          steps[i-1].classList.add("done");
        }
        step.classList.add("active");
        if (i === steps.length - 1) setTimeout(() => {
          step.classList.remove("active");
          step.classList.add("done");
          btn.disabled = false;
        }, 600);
      }, i * 750));
    });
  }

  function provider() {
    const result = document.querySelector("[data-provider-result]");
    const badge = document.querySelector("[data-provider-badge]");
    if (!result || !badge) return;
    const states = {
      ups:["UPS native provider selected","Native","native"],
      unknown:["Carrier not recognized - 17TRACK fallback selected","Fallback","fallback"],
      fail:["Native provider unavailable - fallback activated","Fallback","fallback"]
    };
    all("[data-provider]").forEach(btn => btn.addEventListener("click", () => {
      all("[data-provider]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const [text,label,state] = states[btn.dataset.provider] || states.unknown;
      result.textContent = text;
      badge.textContent = label;
      badge.dataset.state = state;
    }));
  }

  function copy() {
    all("[data-copy]").forEach(btn => btn.addEventListener("click", async () => {
      const old = btn.textContent;
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = btn.dataset.success || "Copied";
        setTimeout(() => btn.textContent = old, 1400);
      } catch {}
    }));
  }

  function init() {
    reveal();
    github();
    filters();
    timeline();
    provider();
    copy();
  }

  if (typeof document$ !== "undefined") document$.subscribe(init);
  else document.addEventListener("DOMContentLoaded", init);
})();
