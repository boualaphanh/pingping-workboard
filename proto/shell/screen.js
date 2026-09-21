/* PingPing prototype — per-screen runtime.
   Reads ?app=&theme=&lang=&state= (or postMessage from the hub), applies them to <body>,
   fills [data-i18n] from i18n/*.js and [data-nm]/[data-val] from fixtures/seed.js.
   No network calls: i18n and fixtures are loaded as <script>, never fetched.
   THROWAWAY PROTOTYPE — DO NOT COPY INTO pingping-mobile. */

(function () {
  "use strict";

  var DEFAULTS = { theme: "light", lang: "en", state: "ok" };

  function params() {
    var q = new URLSearchParams(location.search);
    return {
      app: q.get("app") || document.body.getAttribute("data-app") || "parent",
      theme: q.get("theme") || DEFAULTS.theme,
      lang: q.get("lang") || DEFAULTS.lang,
      state: q.get("state") || DEFAULTS.state,
    };
  }

  function dict() {
    var lang = document.body.getAttribute("data-lang") || DEFAULTS.lang;
    return (window.PP_I18N && window.PP_I18N[lang]) || (window.PP_I18N && window.PP_I18N.en) || {};
  }

  function fill(str, args) {
    if (!args) return str;
    return str.replace(/\{(\w+)\}/g, function (whole, key) {
      return Object.prototype.hasOwnProperty.call(args, key) ? args[key] : whole;
    });
  }

  function t(key, args) {
    var d = dict();
    var s = d[key];
    if (s === undefined) return "⟦" + key + "⟧"; // a missing key must be visible, never blank
    return fill(s, args);
  }

  function resolve(path) {
    if (!path) return undefined;
    return path.split(".").reduce(function (acc, part) {
      if (acc === undefined || acc === null) return undefined;
      return acc[/^\d+$/.test(part) ? Number(part) : part];
    }, window.PP_SEED);
  }

  function localisedName(path) {
    var node = resolve(path);
    if (!node) return "⟦" + path + "⟧";
    var lang = document.body.getAttribute("data-lang") || DEFAULTS.lang;
    return lang === "lo" ? node.lo || node.latin : node.latin || node.lo;
  }


  /* Draws a face from the fixture's avatar config. A real profile photo replaces this
     one-for-one in the app; the prototype ships no image files on purpose. */
  var avatarSeq = 0;
  function avatarSvg(cfg) {
    if (!cfg) cfg = { style: "short", skin: "#DDBB99", hair: "#221A14", shirt: "#788", bg: "#EEE" };
    var id = "ppa" + ++avatarSeq;
    var hair = {
      short: '<path d="M12 22 a12 12 0 0 1 24 0 v-3 a12 12 0 0 0 -24 0 z" fill="' + cfg.hair + '"/>',
      long: '<path d="M12 22 a12 12 0 0 1 24 0 v-3 a12 12 0 0 0 -24 0 z" fill="' + cfg.hair + '"/>' +
            '<path d="M11 20 q-1 12 1 18 h4 q-3 -9 -2 -18 z" fill="' + cfg.hair + '"/>' +
            '<path d="M37 20 q1 12 -1 18 h-4 q3 -9 2 -18 z" fill="' + cfg.hair + '"/>',
      ponytail: '<path d="M12 22 a12 12 0 0 1 24 0 v-3 a12 12 0 0 0 -24 0 z" fill="' + cfg.hair + '"/>' +
                '<circle cx="38" cy="18" r="5" fill="' + cfg.hair + '"/>' +
                '<circle cx="10" cy="18" r="5" fill="' + cfg.hair + '"/>'
    }[cfg.style] || "";
    return '<svg viewBox="0 0 48 48" role="img" aria-hidden="true" focusable="false">' +
      '<defs><clipPath id="' + id + '"><rect width="48" height="48" rx="24"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + ')">' +
        '<rect width="48" height="48" fill="' + cfg.bg + '"/>' +
        '<path d="M24 32 c-9 0 -15 6 -16 16 h32 c-1 -10 -7 -16 -16 -16 z" fill="' + cfg.shirt + '"/>' +
        '<circle cx="24" cy="22" r="11" fill="' + cfg.skin + '"/>' +
        hair +
        '<circle cx="20" cy="23" r="1.4" fill="#2A2320"/>' +
        '<circle cx="28" cy="23" r="1.4" fill="#2A2320"/>' +
        '<path d="M21 27.5 q3 2.2 6 0" stroke="#2A2320" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
      '</g></svg>';
  }


  function duration(minutes) {
    var n = Number(minutes);
    if (!isFinite(n) || n < 0) return "—";
    if (n < 60) return t("common_dur_m", { m: n });
    return t("common_dur_hm", { h: Math.floor(n / 60), m: n % 60 });
  }

  function argsOf(el) {
    var raw = el.getAttribute("data-i18n-args");
    if (!raw) return null;
    var out = {};
    raw.split(";").forEach(function (pair) {
      var bits = pair.split(":");
      if (bits.length < 2) return;
      var key = bits[0].trim();
      var value = bits.slice(1).join(":").trim();
      // ~ = a fixture path holding minutes, rendered as a duration
      if (value.charAt(0) === "~") {
        out[key] = duration(resolve(value.slice(1)));
      } else if (value.charAt(0) === "@") {
        var p = value.slice(1);
        out[key] = p.indexOf("#") === 0 ? localisedName(p.slice(1)) : resolve(p);
      } else if (value.charAt(0) === "#") {
        out[key] = localisedName(value.slice(1));
      } else {
        out[key] = value;
      }
    });
    return out;
  }

  function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"), argsOf(el));
    });
    // data-i18n-attr="label:p02_phone_label,placeholder:p02_phone_hint"
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var bits = pair.split(":");
        if (bits.length !== 2) return;
        el.setAttribute(bits[0].trim(), t(bits[1].trim(), argsOf(el)));
      });
    });
    document.querySelectorAll("[data-nm]").forEach(function (el) {
      el.textContent = localisedName(el.getAttribute("data-nm"));
    });
    // an avatar carries the first character of the localised name, not the whole name
    document.querySelectorAll("[data-nm-initial]").forEach(function (el) {
      var name = localisedName(el.getAttribute("data-nm-initial"));
      el.textContent = Array.from(name)[0] || "?";
    });
    document.querySelectorAll("[data-avatar]").forEach(function (el) {
      var node = resolve(el.getAttribute("data-avatar"));
      el.innerHTML = avatarSvg(node && node.avatar);
    });
    document.querySelectorAll("[data-val]").forEach(function (el) {
      var v = resolve(el.getAttribute("data-val"));
      el.textContent = v === undefined ? "⟦" + el.getAttribute("data-val") + "⟧" : String(v);
    });
    document.documentElement.setAttribute("lang", document.body.getAttribute("data-lang"));
  }

  function apply(p) {
    var b = document.body;
    b.setAttribute("data-app", p.app);
    b.setAttribute("data-theme", p.theme);
    b.setAttribute("data-lang", p.lang);
    b.setAttribute("data-state", p.state);
    applyI18n();
  }

  function badge() {
    if (document.querySelector(".pp-proto-badge")) return;
    var el = document.createElement("div");
    el.className = "pp-proto-badge";
    el.setAttribute("data-i18n", "common_proto_badge");
    document.body.appendChild(el);
  }

  var current = params();

  function boot() {
    badge();
    apply(current);
    // the hub drives lang/theme/state without a reload
    window.addEventListener("message", function (ev) {
      if (!ev.data || ev.data.type !== "pp-set") return;
      ["theme", "lang", "state"].forEach(function (k) {
        if (ev.data[k]) current[k] = ev.data[k];
      });
      apply(current);
    });
    // SOS press-and-hold, used by K02 and K03
    document.querySelectorAll("[data-hold]").forEach(function (el) {
      var timer = null;
      var ms = Number(el.getAttribute("data-hold")) || 3000;
      var start = function () {
        el.setAttribute("data-holding", "");
        timer = setTimeout(function () {
          el.removeAttribute("data-holding");
          el.setAttribute("data-held", "");
        }, ms);
      };
      var stop = function () {
        el.removeAttribute("data-holding");
        if (timer) clearTimeout(timer);
      };
      el.addEventListener("pointerdown", start);
      el.addEventListener("pointerup", stop);
      el.addEventListener("pointerleave", stop);
      el.addEventListener("pointercancel", stop);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.PP = { t: t, resolve: resolve, apply: apply, avatar: avatarSvg, duration: duration };
})();
