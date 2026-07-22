
(() => {
  "use strict";
  const all = (s, r = document) => Array.from(r.querySelectorAll(s));

  function reveal() {
    const nodes = all(".ph4-reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(n => n.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    }), {threshold: .12});
    nodes.forEach(n => io.observe(n));
  }

  async function github() {
    const stars = document.getElementById("ph4-stars");
    const version = document.getElementById("ph4-version");
    const label = document.getElementById("ph4-release-label");
    try {
      const [repoRes, releaseRes] = await Promise.all([
        fetch("https://api.github.com/repos/eifeldj/pakethub"),
        fetch("https://api.github.com/repos/eifeldj/pakethub/releases/latest")
      ]);
      if (repoRes.ok && stars) {
        const repo = await repoRes.json();
        stars.textContent = new Intl.NumberFormat().format(repo.stargazers_count || 0);
      }
      if (releaseRes.ok) {
        const release = await releaseRes.json();
        const tag = release.tag_name || release.name || "Latest";
        if (version) version.textContent = tag;
        if (label) label.textContent = `PaketHub ${tag} available`;
      }
    } catch (_) {}
  }

  function filters() {
    all("[data-demo-root]").forEach(root => {
      const buttons = all("[data-demo-filter]", root);
      const cards = all("[data-demo-state]", root);
      buttons.forEach(button => button.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("is-active"));
        button.classList.add("is-active");
        const filter = button.dataset.demoFilter;
        cards.forEach(card => card.hidden = filter !== "all" && card.dataset.demoState !== filter);
      }));
    });
  }

  function timeline() {
    const button = document.querySelector("[data-run-timeline]");
    const steps = all(".ph4-timeline-step");
    if (!button || !steps.length) return;
    button.addEventListener("click", () => {
      if (button.disabled) return;
      button.disabled = true;
      steps.forEach(s => s.classList.remove("is-active", "is-complete"));
      steps.forEach((step, index) => setTimeout(() => {
        if (index > 0) {
          steps[index - 1].classList.remove("is-active");
          steps[index - 1].classList.add("is-complete");
        }
        step.classList.add("is-active");
        if (index === steps.length - 1) setTimeout(() => {
          step.classList.remove("is-active");
          step.classList.add("is-complete");
          button.disabled = false;
        }, 650);
      }, index * 800));
    });
  }

  function providers() {
    const buttons = all("[data-provider]");
    const result = document.querySelector("[data-provider-result]");
    const badge = document.querySelector("[data-provider-badge]");
    if (!result || !badge) return;
    const states = {
      ups: ["UPS native provider selected", "Native", "native"],
      unknown: ["Carrier not recognized — 17TRACK fallback selected", "Fallback", "fallback"],
      fail: ["Native provider unavailable — automatic fallback activated", "Fallback", "fallback"]
    };
    buttons.forEach(button => button.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("is-active"));
      button.classList.add("is-active");
      const [text, name, state] = states[button.dataset.provider] || states.unknown;
      result.textContent = text;
      badge.textContent = name;
      badge.dataset.state = state;
    }));
  }

  function copyButtons() {
    all("[data-copy-value]").forEach(button => button.addEventListener("click", async () => {
      const old = button.textContent;
      try {
        await navigator.clipboard.writeText(button.dataset.copyValue);
        button.textContent = button.dataset.copySuccess || "Copied";
        setTimeout(() => button.textContent = old, 1400);
      } catch (_) {}
    }));
  }

  function init() {
    reveal(); github(); filters(); timeline(); providers(); copyButtons();
  }
  if (typeof document$ !== "undefined") document$.subscribe(init);
  else document.addEventListener("DOMContentLoaded", init);
})();
