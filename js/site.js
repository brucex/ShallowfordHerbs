(function () {
  var btn = document.querySelector(".menu-btn");
  var panel = document.getElementById("mobile-panel");
  var label = btn && btn.querySelector(".mb-label");
  var inertTargets = document.querySelectorAll(".skip, .utility, main, footer");
  var scrollY = 0;

  function visible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function lockScroll(on) {
    if (on) {
      scrollY = window.scrollY || window.pageYOffset || 0;
      document.body.style.position = "fixed";
      document.body.style.top = "-" + scrollY + "px";
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }
  }

  function setInert(on) {
    Array.prototype.forEach.call(inertTargets, function (el) {
      if ("inert" in el) el.inert = on;
    });
  }

  function setOpen(open, opts) {
    opts = opts || {};
    document.body.classList.toggle("nav-open", open);
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (label) label.textContent = open ? "Close" : "Menu";
    lockScroll(open);
    setInert(open);
    if (open) {
      var first = panel && panel.querySelector("a[href]");
      if (first) first.focus({ preventScroll: true });
    } else if (opts.restoreFocus && btn) {
      btn.focus({ preventScroll: true });
    }
  }

  if (btn && panel) {
    btn.addEventListener("click", function () {
      var open = !document.body.classList.contains("nav-open");
      setOpen(open, { restoreFocus: !open });
    });

    document.addEventListener("keydown", function (e) {
      if (!document.body.classList.contains("nav-open")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false, { restoreFocus: true });
        return;
      }
      if (e.key !== "Tab") return;
      var nodes = Array.prototype.filter.call(
        document.querySelectorAll("header a[href], header button"),
        visible
      );
      if (!nodes.length) return;
      var first = nodes[0];
      var last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus({ preventScroll: true });
      }
    });

    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false, { restoreFocus: false });
    });

    var mq = window.matchMedia("(min-width: 901px)");
    var onWide = function (e) {
      if (e.matches && document.body.classList.contains("nav-open")) {
        setOpen(false, { restoreFocus: false });
      }
    };
    if (mq.addEventListener) mq.addEventListener("change", onWide);
    else if (mq.addListener) mq.addListener(onWide);
  }

  var faqLinks = document.querySelectorAll(".faq-nav a");
  if (!faqLinks.length) return;
  var groups = [];
  Array.prototype.forEach.call(faqLinks, function (a) {
    var id = (a.getAttribute("href") || "").slice(1);
    var el = document.getElementById(id);
    if (el) groups.push({ a: a, el: el });
  });
  if (!groups.length) return;
  var ticking = false;
  function spy() {
    ticking = false;
    var line = window.innerWidth <= 900 ? 150 : 120;
    var current = groups[0];
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].el.getBoundingClientRect().top - line <= 0) current = groups[i];
    }
    for (var j = 0; j < groups.length; j++) {
      if (groups[j] === current) groups[j].a.setAttribute("aria-current", "true");
      else groups[j].a.removeAttribute("aria-current");
    }
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(spy);
  }
  spy();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
})();
