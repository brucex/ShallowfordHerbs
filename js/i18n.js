(function () {
  // Desktop globe menu (a disclosure, not an ARIA menu: it is a list of links)
  var sw = document.querySelector("[data-lang-switcher]");
  if (sw) {
    var b = sw.querySelector(".lang-btn");
    var set = function (open) { sw.classList.toggle("open", open); b.setAttribute("aria-expanded", open); };
    b.addEventListener("click", function () { set(!sw.classList.contains("open")); });
    document.addEventListener("click", function (e) { if (!sw.contains(e.target)) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && sw.classList.contains("open")) { set(false); b.focus(); } });
  }
  // Mobile globe opens the menu panel and focuses the language row
  var fab = document.querySelector(".lang-fab"), menuBtn = document.querySelector(".menu-btn");
  if (fab && menuBtn) fab.addEventListener("click", function () {
    if (!document.body.classList.contains("nav-open")) menuBtn.click();
    var c = document.querySelector(".mp-lang a[aria-current]") || document.querySelector(".mp-lang a");
    if (c) c.focus({ preventScroll: true });
  });
  // Remember an explicit choice only. Nothing here ever redirects.
  document.querySelectorAll("a[data-lang], .foot-langs a").forEach(function (a) {
    a.addEventListener("click", function () {
      try { localStorage.setItem("sh-lang", a.getAttribute("data-lang") || a.getAttribute("lang")); } catch (e) {}
    });
  });
})();
