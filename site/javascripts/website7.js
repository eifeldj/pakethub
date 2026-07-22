
(() => {
  "use strict";
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];

  function reveal() {
    const items = all(".ph7-reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(item => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    items.forEach(item => observer.observe(item));
  }

  async function loadGitHub() {
    try {
      const [repoResponse, releaseResponse] = await Promise.all([
        fetch("https://api.github.com/repos/eifeldj/pakethub"),
        fetch("https://api.github.com/repos/eifeldj/pakethub/releases/latest")
      ]);

      if (repoResponse.ok) {
        const repo = await repoResponse.json();
        const mapping = {
          "ph7-stars": repo.stargazers_count || 0,
          "ph7-forks": repo.forks_count || 0,
          "ph7-issues": repo.open_issues_count || 0
        };
        Object.entries(mapping).forEach(([id, value]) => {
          const node = document.getElementById(id);
          if (node) node.textContent = new Intl.NumberFormat().format(value);
        });
      }

      if (releaseResponse.ok) {
        const release = await releaseResponse.json();
        const tag = release.tag_name || release.name || "Latest";
        const version = document.getElementById("ph7-version");
        const label = document.getElementById("ph7-release-label");
        if (version) version.textContent = tag;
        if (label) label.textContent = `PaketHub ${tag} available`;
      }
    } catch {}
  }

  function dashboardFilters() {
    all("[data-ph7-demo]").forEach(root => {
      const buttons = all("[data-ph7-filter]", root);
      const cards = all("[data-ph7-state]", root);
      buttons.forEach(button => {
        button.addEventListener("click", () => {
          buttons.forEach(item => item.classList.remove("is-active"));
          button.classList.add("is-active");
          const filter = button.dataset.ph7Filter;
          cards.forEach(card => {
            card.hidden = filter !== "all" && card.dataset.ph7State !== filter;
          });
        });
      });
    });
  }

  function liveDashboard() {
    const live = document.querySelector(".ph7-live");
    const eta = document.querySelector("[data-ph7-live-eta]");
    const progress = document.querySelector("[data-ph7-live-progress]");
    const status = document.querySelector("[data-ph7-live-status]");
    if (!live || !eta || !progress || !status) return;

    let delivered = false;
    setInterval(() => {
      delivered = !delivered;
      eta.textContent = delivered ? "Delivered" : "Tomorrow";
      status.textContent = delivered ? "Delivered · Front door" : "UPS · In transit · Vienna";
      progress.style.width = delivered ? "100%" : "72%";
      live.textContent = delivered ? "UPDATED" : "LIVE";
    }, 4200);
  }

  function timeline() {
    const button = document.querySelector("[data-ph7-run]");
    const steps = all(".ph7-timeline-step");
    if (!button || !steps.length) return;

    button.addEventListener("click", () => {
      if (button.disabled) return;
      button.disabled = true;
      steps.forEach(step => step.classList.remove("is-active", "is-done"));

      steps.forEach((step, index) => {
        setTimeout(() => {
          if (index > 0) {
            steps[index - 1].classList.remove("is-active");
            steps[index - 1].classList.add("is-done");
          }
          step.classList.add("is-active");

          if (index === steps.length - 1) {
            setTimeout(() => {
              step.classList.remove("is-active");
              step.classList.add("is-done");
              button.disabled = false;
            }, 650);
          }
        }, index * 760);
      });
    });
  }

  function providerDemo() {
    const output = document.querySelector("[data-ph7-provider-result]");
    const badge = document.querySelector("[data-ph7-provider-badge]");
    if (!output || !badge) return;

    const states = {
      ups: ["UPS native provider selected", "Native", "native"],
      unknown: ["Carrier unknown - 17TRACK fallback selected", "Fallback", "fallback"],
      failure: ["Native provider unavailable - fallback activated", "Fallback", "fallback"]
    };

    all("[data-ph7-provider]").forEach(button => {
      button.addEventListener("click", () => {
        all("[data-ph7-provider]").forEach(item => item.classList.remove("is-active"));
        button.classList.add("is-active");
        const [text, label, state] = states[button.dataset.ph7Provider] || states.unknown;
        output.textContent = text;
        badge.textContent = label;
        badge.dataset.state = state;
      });
    });
  }

  function copyButtons() {
    all("[data-ph7-copy]").forEach(button => {
      button.addEventListener("click", async () => {
        const previous = button.textContent;
        try {
          await navigator.clipboard.writeText(button.dataset.ph7Copy);
          button.textContent = button.dataset.success || "Copied";
          setTimeout(() => button.textContent = previous, 1400);
        } catch {}
      });
    });
  }

  function parallax() {
    const hero = document.querySelector(".ph7-hero");
    const dashboard = document.querySelector(".ph7-dashboard");
    if (!hero || !dashboard || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    hero.addEventListener("pointermove", event => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 4;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -3;
      dashboard.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${y}deg)`;
    });

    hero.addEventListener("pointerleave", () => {
      dashboard.style.transform = "";
    });
  }

  function init() {
    reveal();
    loadGitHub();
    dashboardFilters();
    liveDashboard();
    timeline();
    providerDemo();
    copyButtons();
    parallax();
  }

  if (typeof document$ !== "undefined") document$.subscribe(init);
  else document.addEventListener("DOMContentLoaded", init);
})();
