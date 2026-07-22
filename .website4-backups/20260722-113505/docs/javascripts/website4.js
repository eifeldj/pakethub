
(() => {
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  const formatNumber = (value) => {
    try {
      return new Intl.NumberFormat().format(value);
    } catch (_) {
      return String(value);
    }
  };

  const animateCounter = (node) => {
    if (node.dataset.animated === "true") return;
    node.dataset.animated = "true";

    const target = Number(node.dataset.count || 0);
    const suffix = node.dataset.suffix || "";
    const duration = 900;
    const start = performance.now();

    const frame = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = `${formatNumber(Math.round(target * eased))}${suffix}`;
      if (p < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  const setupCounters = () => {
    const nodes = qsa("[data-count]");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    nodes.forEach((node) => observer.observe(node));
  };

  const setupReveal = () => {
    const nodes = qsa(".ph4-reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    nodes.forEach((node) => observer.observe(node));
  };

  const loadGitHubStats = async () => {
    const releaseLabel = document.getElementById("ph4-release-label");
    const versionNode = document.getElementById("ph4-version");
    const starsNode = document.getElementById("ph4-stars");
    const forksNode = document.getElementById("ph4-forks");
    const issuesNode = document.getElementById("ph4-issues");

    try {
      const [repoResponse, releaseResponse] = await Promise.all([
        fetch("https://api.github.com/repos/eifeldj/pakethub", {
          headers: { Accept: "application/vnd.github+json" }
        }),
        fetch("https://api.github.com/repos/eifeldj/pakethub/releases/latest", {
          headers: { Accept: "application/vnd.github+json" }
        })
      ]);

      if (repoResponse.ok) {
        const repo = await repoResponse.json();
        if (starsNode) starsNode.textContent = formatNumber(repo.stargazers_count || 0);
        if (forksNode) forksNode.textContent = formatNumber(repo.forks_count || 0);
        if (issuesNode) issuesNode.textContent = formatNumber(repo.open_issues_count || 0);
      }

      if (releaseResponse.ok) {
        const release = await releaseResponse.json();
        const version = release.tag_name || release.name || "Latest";
        if (versionNode) versionNode.textContent = version;
        if (releaseLabel) releaseLabel.textContent = `PaketHub ${version} available`;
      }
    } catch (_) {
      // Static fallbacks remain visible.
    }
  };

  const setupCopyButtons = () => {
    qsa("[data-copy-value]").forEach((button) => {
      button.addEventListener("click", async () => {
        const original = button.textContent;
        try {
          await navigator.clipboard.writeText(button.dataset.copyValue);
          button.textContent = button.dataset.copySuccess || "Copied";
          button.classList.add("is-success");
          setTimeout(() => {
            button.textContent = original;
            button.classList.remove("is-success");
          }, 1500);
        } catch (_) {}
      });
    });
  };

  const setupDemoFilters = () => {
    qsa("[data-demo-root]").forEach((root) => {
      const buttons = qsa("[data-demo-filter]", root);
      const cards = qsa("[data-demo-state]", root);

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          buttons.forEach((item) => item.classList.remove("is-active"));
          button.classList.add("is-active");

          const filter = button.dataset.demoFilter;
          cards.forEach((card) => {
            const visible = filter === "all" || card.dataset.demoState === filter;
            card.hidden = !visible;
          });
        });
      });
    });
  };

  const setupTimelineDemo = () => {
    const button = document.querySelector("[data-run-timeline]");
    const steps = qsa(".ph4-timeline-step");
    if (!button || !steps.length) return;

    button.addEventListener("click", () => {
      steps.forEach((step) => step.classList.remove("is-complete", "is-active"));
      button.disabled = true;

      steps.forEach((step, index) => {
        setTimeout(() => {
          if (index > 0) steps[index - 1].classList.remove("is-active");
          step.classList.add("is-active");
          if (index < steps.length - 1) step.classList.add("is-complete");

          if (index === steps.length - 1) {
            setTimeout(() => {
              step.classList.remove("is-active");
              step.classList.add("is-complete");
              button.disabled = false;
            }, 700);
          }
        }, index * 850);
      });
    });
  };

  const setupProviderDemo = () => {
    const buttons = qsa("[data-provider]");
    const target = document.querySelector("[data-provider-result]");
    const badge = document.querySelector("[data-provider-badge]");
    if (!buttons.length || !target || !badge) return;

    const messages = {
      ups: ["UPS native provider selected", "Native"],
      unknown: ["Carrier not recognized — 17TRACK fallback selected", "Fallback"],
      fail: ["Native provider unavailable — automatic fallback activated", "Fallback"]
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        const [message, state] = messages[button.dataset.provider] || messages.unknown;
        target.textContent = message;
        badge.textContent = state;
        badge.dataset.state = state.toLowerCase();
      });
    });
  };

  const setupParallax = () => {
    const hero = document.querySelector(".ph4-hero");
    const mockup = document.querySelector(".ph4-dashboard");
    if (!hero || !mockup || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -6;
      mockup.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;
    });

    hero.addEventListener("pointerleave", () => {
      mockup.style.transform = "";
    });
  };

  const init = () => {
    setupCounters();
    setupReveal();
    loadGitHubStats();
    setupCopyButtons();
    setupDemoFilters();
    setupTimelineDemo();
    setupProviderDemo();
    setupParallax();
  };

  if (typeof document$ !== "undefined") document$.subscribe(init);
  else document.addEventListener("DOMContentLoaded", init);
})();
