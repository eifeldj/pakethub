document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a[href^='http']").forEach((link) => {
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) {
      link.rel = "noopener noreferrer";
    }
  });
});
