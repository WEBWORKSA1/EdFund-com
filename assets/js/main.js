/* EdFund.com — core interactions (vanilla JS, no dependencies) */
(function () {
  "use strict";
  var C = window.EDFUND_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("edf_" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("edf_" + k, JSON.stringify(v)); } catch (e) {} }
  };
  var money = function (n, d) { return (isFinite(n) ? n : 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: d == null ? 0 : d }); };

  /* ---------- Private inbox (decoded only when needed) ---------- */
  function inbox() { return (C._k || []).slice().reverse().map(function (c) { return String.fromCharCode((c ^ 21) - 7); }).join(""); }

  /* ---------- Toast ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 2800);
  }
  window.edfToast = toast;

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var savedTheme = store.get("theme", null);
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
  $$("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      var dark = root.getAttribute("data-theme") === "dark" || (!root.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
      var next = dark ? "light" : "dark"; root.setAttribute("data-theme", next); store.set("theme", next);
    });
  });

  /* ---------- Mobile nav ---------- */
  var menuBtn = $(".menu-btn"), links = $(".nav-links"), scrim = $(".scrim");
  function closeNav() { links && links.classList.remove("open"); scrim && scrim.classList.remove("show"); menuBtn && menuBtn.setAttribute("aria-expanded", "false"); }
  if (menuBtn) menuBtn.addEventListener("click", function () {
    var open = !links.classList.contains("open");
    links.classList.toggle("open", open); scrim.classList.toggle("show", open); menuBtn.setAttribute("aria-expanded", String(open));
  });
  if (scrim) scrim.addEventListener("click", closeNav);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeNav(); $$(".modal.show").forEach(function (m) { m.classList.remove("show"); }); } });

  /* ---------- Year, to-top, reveal ---------- */
  $$("[data-year]").forEach(function (e) { e.textContent = new Date().getFullYear(); });
  var toTop = $(".to-top");
  window.addEventListener("scroll", function () { if (toTop) toTop.classList.toggle("show", scrollY > 700); }, { passive: true });
  if (toTop) toTop.addEventListener("click", function () { scrollTo({ top: 0, behavior: "smooth" }); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; co.unobserve(e.target);
        var el = e.target, end = parseFloat(el.getAttribute("data-count")), pre = el.getAttribute("data-prefix") || "", suf = el.getAttribute("data-suffix") || "", dec = +(el.getAttribute("data-dec") || 0), t0 = null;
        function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / 1400, 1); el.textContent = pre + (end * (1 - Math.pow(1 - p, 3))).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; if (p < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      });
    });
    $$("[data-count]").forEach(function (el) { co.observe(el); });
  } else { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }

  /* ---------- AdSense + GA4 (config driven) ---------- */
  var ads = $$(".ad-slot");
  if (C.adsenseClient) {
    var s = document.createElement("script"); s.async = true; s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + C.adsenseClient; document.head.appendChild(s);
    ads.forEach(function (slot) {
      var key = slot.getAttribute("data-slot") || "inContent";
      slot.innerHTML = '<div class="ad-label">Advertisement</div><ins class="adsbygoogle" style="display:block" data-ad-client="' + C.adsenseClient + '"' + (C.adSlots && C.adSlots[key] ? ' data-ad-slot="' + C.adSlots[key] + '"' : "") + ' data-ad-format="auto" data-full-width-responsive="true"></ins>';
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    });
  } else {
    ads.forEach(function (slot) { slot.innerHTML = '<div class="ad-label">Advertisement</div><div class="ad-ph">Ad space · ' + (slot.getAttribute("data-slot") || "in-content") + "</div>"; });
  }
  if (C.ga4) {
    var g = document.createElement("script"); g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + C.ga4; document.head.appendChild(g);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); }; gtag("js", new Date()); gtag("config", C.ga4);
  }
  function track(ev, p) { try { if (window.gtag) gtag("event", ev, p || {}); } catch (e) {} }

  /* ---------- Attribution (UTM / referral) ---------- */
  var qs = new URLSearchParams(location.search);
  ["utm_source", "utm_medium", "utm_campaign", "ref"].forEach(function (k) { if (qs.get(k)) store.set(k, qs.get(k)); });

  /* ---------- Mail links (address assembled on click only) ---------- */
  $$("[data-mail]").forEach(function (a) {
    a.setAttribute("href", "contact.html");
    a.addEventListener("click", function (e) { e.preventDefault(); location.href = "mai" + "lto:" + inbox() + "?subject=" + encodeURIComponent(a.getAttribute("data-mail") || "EdFund inquiry"); });
  });

  /* ---------- Forms → private inbox via FormSubmit ---------- */
  function validate(scope) {
    var ok = true, first = null;
    $$("input,select,textarea", scope).forEach(function (f) {
      if (f.closest(".hide") || f.type === "hidden" || f.classList.contains("hp")) return;
      var bad = false;
      if (f.type === "radio") { if (f.required && !$('input[name="' + f.name + '"]:checked', scope)) bad = true; }
      else if (f.type === "checkbox") { if (f.required && !f.checked) bad = true; }
      else { bad = !f.checkValidity(); }
      var tgt = f.type === "radio" ? f.closest(".choice-grid") : f;
      if (tgt) tgt.classList.toggle("invalid", bad);
      if (bad) { ok = false; first = first || f; }
    });
    if (first) { try { first.focus({ preventScroll: false }); } catch (e) {} toast("Please complete the highlighted fields."); }
    return ok;
  }
  window.edfValidate = validate;

  function enrich(form) {
    var add = function (n, v) { if (!v) return; var i = form.querySelector('input[name="' + n + '"]'); if (!i) { i = document.createElement("input"); i.type = "hidden"; i.name = n; form.appendChild(i); } i.value = v; };
    add("Page", location.pathname + location.search);
    add("Referrer", document.referrer);
    add("UTM source", store.get("utm_source", "")); add("UTM medium", store.get("utm_medium", "")); add("UTM campaign", store.get("utm_campaign", ""));
    add("Referred by", store.get("ref", ""));
    add("Submitted", new Date().toISOString());
  }

  $$("form[data-form]").forEach(function (form) {
    form.setAttribute("novalidate", "");
    if (!form.querySelector('input[name="_honey"]')) form.insertAdjacentHTML("beforeend", '<input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">');
    if (!form.querySelector(".form-msg")) form.insertAdjacentHTML("beforeend", '<div class="form-msg" role="status" aria-live="polite"></div>');
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      if (form.querySelector('input[name="_honey"]').value) return;
      enrich(form);
      var btn = form.querySelector('[type="submit"]'), msg = form.querySelector(".form-msg"), label = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }
      var data = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        var k = el.name; if (!k || k === "_honey" || el.disabled || el.closest(".hide")) return;
        if ((el.type === "radio" || el.type === "checkbox") && !el.checked) return;
        if (el.tagName === "BUTTON" || el.value === "") return;
        data[k] = data[k] ? data[k] + ", " + el.value : el.value;
      });
      data._subject = "EdFund.com — " + (form.getAttribute("data-form") || "Form") + " submission";
      data._template = "table"; data._captcha = "false";
      fetch("https://formsubmit.co/ajax/" + inbox(), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === "false" || j.success === false) throw new Error(j.message || "Error"); return j; }); })
        .then(function () { done(true); })
        .catch(function () { done(false); });
      function done(ok) {
        if (btn) { btn.disabled = false; btn.innerHTML = label; }
        msg.className = "form-msg " + (ok ? "ok" : "err");
        msg.textContent = ok ? (form.getAttribute("data-success") || "Thank you! We received your submission.") : "Something went wrong. Please try again in a moment.";
        track("generate_lead", { form: form.getAttribute("data-form") });
        if (ok) {
          form.dispatchEvent(new CustomEvent("edf:success", { detail: data }));
          var th = form.getAttribute("data-thanks");
          if (th) { var t = document.getElementById(th); if (t) { form.classList.add("hide"); t.classList.remove("hide"); t.scrollIntoView({ behavior: "smooth", block: "center" }); } }
          else form.reset();
        }
      }
    });
  });

  /* ---------- Multi-step wizards ---------- */
  $$("[data-wizard]").forEach(function (wz) {
    var steps = $$(".step", wz), i = 0, bar = $(".progress i", wz), lab = $("[data-step-label]", wz);
    function show(n) {
      i = Math.max(0, Math.min(n, steps.length - 1));
      steps.forEach(function (s, k) { s.classList.toggle("active", k === i); });
      if (bar) bar.style.width = ((i + 1) / steps.length * 100) + "%";
      if (lab) lab.textContent = "Step " + (i + 1) + " of " + steps.length;
      wz.dispatchEvent(new CustomEvent("edf:step", { detail: i }));
    }
    wz.addEventListener("click", function (e) {
      var nx = e.target.closest("[data-next]"), pv = e.target.closest("[data-prev]");
      if (nx) { e.preventDefault(); if (validate(steps[i])) { show(i + 1); var y = wz.getBoundingClientRect().top + scrollY - 110; if (y < scrollY) scrollTo({ top: y, behavior: "smooth" }); } }
      if (pv) { e.preventDefault(); show(i - 1); }
    });
    wz.addEventListener("change", function (e) {
      if (e.target.type === "radio" && e.target.closest("[data-autonext]")) setTimeout(function () { if (validate(steps[i])) show(i + 1); }, 220);
      $$("[data-show-if]", wz).forEach(function (el) {
        var p = el.getAttribute("data-show-if").split("="), ch = wz.querySelector('input[name="' + p[0] + '"]:checked');
        el.classList.toggle("hide", !(ch && p[1].split("|").indexOf(ch.value) > -1));
      });
    });
    show(0);
  });

  /* ---------- Tabs ---------- */
  $$("[data-tabs]").forEach(function (tabs) {
    var btns = $$(".tab", tabs);
    function sel(b) {
      btns.forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); var p = document.getElementById(x.getAttribute("aria-controls")); if (p) p.classList.toggle("active", x === b); });
    }
    btns.forEach(function (b) { b.addEventListener("click", function () { sel(b); history.replaceState(null, "", "#" + b.getAttribute("aria-controls")); }); });
    var h = location.hash.slice(1), m = btns.filter(function (b) { return b.getAttribute("aria-controls") === h; })[0];
    sel(m || btns[0]);
  });

  /* ---------- Lite YouTube ---------- */
  function videoCard(v) {
    return '<div class="reveal in"><div class="video" data-yt="' + v.id + '" role="button" tabindex="0" aria-label="Play video: ' + v.t.replace(/"/g, "") + '"><img loading="lazy" src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg" alt=""><span class="play" aria-hidden="true"></span></div><div class="video-title">' + v.t + '</div><span class="tag blue">' + v.cat + "</span></div>";
  }
  function playYT(el) { el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + el.getAttribute("data-yt") + '?autoplay=1&rel=0" title="YouTube video" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'; track("video_play", { id: el.getAttribute("data-yt") }); }
  document.addEventListener("click", function (e) { var v = e.target.closest(".video[data-yt]"); if (v && !v.querySelector("iframe")) playYT(v); });
  document.addEventListener("keydown", function (e) { var v = e.target.closest && e.target.closest(".video[data-yt]"); if (v && (e.key === "Enter" || e.key === " ") && !v.querySelector("iframe")) { e.preventDefault(); playYT(v); } });
  $$("[data-videos]").forEach(function (box) {
    var list = window.EDFUND_VIDEOS || [], lim = +box.getAttribute("data-limit") || list.length;
    function render(cat) { box.innerHTML = list.filter(function (v) { return !cat || cat === "All" || v.cat === cat; }).slice(0, lim).map(videoCard).join(""); }
    render();
    var chips = $("[data-video-filter]");
    if (chips && box.hasAttribute("data-filterable")) {
      var cats = ["All"].concat(list.map(function (v) { return v.cat; }).filter(function (c, k, a) { return a.indexOf(c) === k; }));
      chips.innerHTML = cats.map(function (c, k) { return '<button class="btn btn-sm ' + (k ? "btn-ghost" : "btn-primary") + '" data-cat="' + c + '">' + c + "</button>"; }).join("");
      chips.addEventListener("click", function (e) { var b = e.target.closest("[data-cat]"); if (!b) return; $$("[data-cat]", chips).forEach(function (x) { x.className = "btn btn-sm " + (x === b ? "btn-primary" : "btn-ghost"); }); render(b.getAttribute("data-cat")); });
    }
  });
  $$("[data-yt-subscribe]").forEach(function (a) { a.href = C.social && C.social.youtube || C.youtubeChannel; a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-social]").forEach(function (a) { var k = a.getAttribute("data-social"); if (C.social && C.social[k]) { a.href = C.social[k]; a.target = "_blank"; a.rel = "noopener"; } });

  /* ---------- Scholarship database ---------- */
  var DB = window.EDFUND_SCHOLARSHIPS || [];
  var saved = store.get("saved", []);
  function schCard(s) {
    var isSaved = saved.indexOf(s.n) > -1, ext = !s.own;
    return '<article class="card hover sch-card reveal in"><div>' +
      (s.own ? '<span class="tag gold">EdFund Exclusive</span>' : "") + (s.ne ? '<span class="tag green">No essay</span>' : "") + (s.cat === "No-Essay" ? "" : '<span class="tag blue">' + s.cat + "</span>") + "</div>" +
      '<div class="amt">' + s.a + '</div><h3 style="font-size:1.08rem">' + s.n + '</h3>' +
      '<div class="meta">' + s.p + " · " + s.c + "<br>Level: " + s.l.join(", ") + "<br>Typical deadline: <b>" + s.d + "</b></div>" +
      '<div class="actions"><a class="btn btn-primary btn-sm" href="' + s.u + '"' + (ext ? ' target="_blank" rel="nofollow noopener"' : "") + ">" + (s.own ? "Enter free" : "Official site ↗") + "</a>" +
      '<button class="btn btn-ghost btn-sm save-btn" data-save="' + s.n.replace(/"/g, "&quot;") + '" aria-pressed="' + isSaved + '">' + (isSaved ? "★ Saved" : "☆ Save") + "</button></div></article>";
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-save]"); if (!b) return;
    var n = b.getAttribute("data-save"), k = saved.indexOf(n);
    if (k > -1) saved.splice(k, 1); else saved.push(n);
    store.set("saved", saved); b.setAttribute("aria-pressed", k < 0); b.textContent = k < 0 ? "★ Saved" : "☆ Save";
    toast(k < 0 ? "Saved to your list" : "Removed from your list");
    var sc = $("[data-saved-count]"); if (sc) sc.textContent = saved.length;
  });
  var feat = $("#featured-sch");
  if (feat) feat.innerHTML = DB.filter(function (s) { return s.own || s.v >= 20000; }).slice(0, 6).map(schCard).join("");
  var grid = $("#sch-grid");
  if (grid) {
    var f = { q: $("#f-q"), c: $("#f-country"), l: $("#f-level"), cat: $("#f-cat"), sort: $("#f-sort"), ne: $("#f-ne"), sv: $("#f-saved") };
    var countries = DB.map(function (s) { return s.c; }).filter(function (c, k, a) { return a.indexOf(c) === k; }).sort();
    var cats = DB.map(function (s) { return s.cat; }).filter(function (c, k, a) { return a.indexOf(c) === k; }).sort();
    countries.forEach(function (c) { f.c.insertAdjacentHTML("beforeend", "<option>" + c + "</option>"); });
    cats.forEach(function (c) { f.cat.insertAdjacentHTML("beforeend", "<option>" + c + "</option>"); });
    if (qs.get("cat")) f.cat.value = qs.get("cat");
    if (qs.get("country")) f.c.value = qs.get("country");
    if (qs.get("level")) f.l.value = qs.get("level");
    function run() {
      var q = f.q.value.trim().toLowerCase();
      var list = DB.filter(function (s) {
        return (!q || (s.n + " " + s.p + " " + s.cat + " " + s.c).toLowerCase().indexOf(q) > -1) &&
          (!f.c.value || s.c === f.c.value || s.c === "Global") && (!f.l.value || s.l.indexOf(f.l.value) > -1) &&
          (!f.cat.value || s.cat === f.cat.value) && (!f.ne.checked || s.ne) && (!f.sv.checked || saved.indexOf(s.n) > -1);
      });
      var so = f.sort.value;
      list.sort(function (a, b) { if (a.own) return -1; if (b.own) return 1; return so === "az" ? a.n.localeCompare(b.n) : so === "low" ? a.v - b.v : b.v - a.v; });
      var html = [];
      list.forEach(function (s, k) { html.push(schCard(s)); if ((k + 1) % 6 === 0 && k < list.length - 1) html.push('<div class="ad-slot" data-slot="inFeed" style="grid-column:1/-1;padding:0;margin:0"></div>'); });
      grid.innerHTML = html.join("") || '<div class="card" style="grid-column:1/-1">No matches. Try removing a filter, or <a href="get-funded.html">let us match you personally</a>.</div>';
      $("#sch-count").textContent = list.length;
      $$(".ad-slot", grid).forEach(function (slot) { slot.innerHTML = C.adsenseClient ? '<div class="ad-label">Advertisement</div><ins class="adsbygoogle" style="display:block" data-ad-client="' + C.adsenseClient + '" data-ad-format="fluid" data-ad-layout-key="-fb+5w+4e-db+86"></ins>' : '<div class="ad-label">Advertisement</div><div class="ad-ph">Ad space · in-feed</div>'; if (C.adsenseClient) try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {} });
    }
    [f.q, f.c, f.l, f.cat, f.sort, f.ne, f.sv].forEach(function (el) { el.addEventListener(el.tagName === "INPUT" && el.type === "search" ? "input" : "change", run); });
    var sc = $("[data-saved-count]"); if (sc) sc.textContent = saved.length;
    run();
  }
  var total = $("[data-sch-total]"); if (total) total.textContent = DB.length;

  /* ---------- Calculators ---------- */
  function num(id) { var el = document.getElementById(id); return el ? parseFloat(el.value) || 0 : 0; }
  function pmt(P, r, n) { if (r === 0) return P / n; var i = r / 12; return P * i / (1 - Math.pow(1 + i, -n)); }
  function set(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
  var calcs = {
    loan: function () {
      var P = num("l-amt"), r = num("l-rate") / 100, n = num("l-years") * 12; if (!n) return;
      var m = pmt(P, r, n), tot = m * n, int = tot - P;
      set("l-out", money(m)); set("l-total", money(tot)); set("l-int", money(int)); set("l-prin", money(P));
      var b = document.getElementById("l-bar"); if (b) b.innerHTML = '<i style="width:' + (P / tot * 100) + '%;background:#5B7FFF"></i><i style="width:' + (int / tot * 100) + '%;background:#F5B400"></i>';
    },
    save: function () {
      var goal = num("s-goal"), have = num("s-have"), yrs = num("s-years"), r = num("s-ret") / 100 / 12, n = yrs * 12; if (!n) return;
      var fvHave = have * Math.pow(1 + r, n), need = Math.max(goal - fvHave, 0);
      var m = r ? need * r / (Math.pow(1 + r, n) - 1) : need / n;
      set("s-out", money(m)); set("s-fv", money(fvHave)); set("s-contrib", money(m * n)); set("s-growth", money(Math.max(goal - fvHave - m * n, 0)));
    },
    gap: function () {
      var cost = num("g-tuition") + num("g-housing") + num("g-books") + num("g-other"), aid = num("g-grants") + num("g-sch") + num("g-savings") + num("g-work");
      var gap = cost - aid; set("g-out", money(Math.max(gap, 0))); set("g-cost", money(cost)); set("g-aid", money(aid));
      set("g-note", gap > 0 ? "Close this gap with more scholarships first, then federal loans, then private loans." : "You're fully covered — nice work. Keep applying to reduce loans further.");
    },
    payoff: function () {
      var P = num("p-bal"), r = num("p-rate") / 100 / 12, base = pmt(P, num("p-rate") / 100, num("p-years") * 12), extra = num("p-extra");
      function sim(pay) { var b = P, mo = 0, int = 0; while (b > 0.01 && mo < 1200) { var i = b * r; int += i; b = b + i - pay; mo++; if (pay <= i) return { mo: Infinity, int: Infinity }; } return { mo: mo, int: int }; }
      var a = sim(base), b = sim(base + extra);
      set("p-base", money(base)); set("p-save", money(a.int - b.int)); set("p-months", (a.mo - b.mo) + " months");
      set("p-out", isFinite(b.mo) ? Math.floor(b.mo / 12) + " yrs " + (b.mo % 12) + " mo" : "—");
    },
    afford: function () {
      var sal = num("a-salary"), r = num("a-rate") / 100, n = num("a-years") * 12, maxDebt = sal;
      var m = pmt(maxDebt, r, n); set("a-out", money(maxDebt)); set("a-pay", money(m)); set("a-pct", (m * 12 / sal * 100 || 0).toFixed(1) + "%");
    }
  };
  Object.keys(calcs).forEach(function (k) {
    var box = document.querySelector('[data-calc="' + k + '"]'); if (!box) return;
    box.addEventListener("input", calcs[k]); calcs[k]();
  });

  /* ---------- Giveaway: countdown + referrals ---------- */
  $$("[data-countdown]").forEach(function (el) {
    function tick() {
      var now = new Date(), end = new Date(now.getFullYear(), now.getMonth() + 1, 1) - 1000, d = Math.max(end - now, 0);
      var parts = [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60];
      el.innerHTML = ["Days", "Hrs", "Min", "Sec"].map(function (l, k) { return "<div><b>" + String(parts[k]).padStart(2, "0") + "</b><span>" + l + "</span></div>"; }).join("");
    }
    tick(); setInterval(tick, 1000);
  });
  $$("[data-month]").forEach(function (el) { el.textContent = new Date().toLocaleString("en-US", { month: "long", year: "numeric" }); });
  function refCode(s) { var h = 0; for (var k = 0; k < s.length; k++) h = (h * 31 + s.charCodeAt(k)) >>> 0; return h.toString(36).toUpperCase(); }
  $$("form[data-giveaway]").forEach(function (form) {
    form.addEventListener("edf:success", function (e) {
      var code = refCode((e.detail.Email || e.detail.email || "") + "edf"), link = location.origin + location.pathname.replace(/[^/]*$/, "") + "giveaway.html?ref=" + code;
      store.set("myref", code);
      var out = document.getElementById("ref-link"); if (out) out.value = link;
    });
  });
  var myref = store.get("myref", ""), rl = document.getElementById("ref-link");
  if (rl && myref) rl.value = location.origin + location.pathname.replace(/[^/]*$/, "") + "giveaway.html?ref=" + myref;
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = document.getElementById(b.getAttribute("data-copy")); if (!t || !t.value) { toast("Enter the giveaway first to get your link."); return; }
      t.select(); try { navigator.clipboard.writeText(t.value); } catch (e) { document.execCommand("copy"); } toast("Link copied — share it for bonus entries!");
    });
  });
  $$("[data-share]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault(); var url = (rl && rl.value) || location.href, txt = "I just entered a free $" + ((C.giveaway || {}).amount || 1000) + " no-essay scholarship on EdFund. Enter here:";
      var net = a.getAttribute("data-share"), map = { x: "https://x.com/intent/tweet?text=" + encodeURIComponent(txt) + "&url=" + encodeURIComponent(url), fb: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url), wa: "https://wa.me/?text=" + encodeURIComponent(txt + " " + url), li: "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url) };
      if (net === "native" && navigator.share) { navigator.share({ title: "EdFund", text: txt, url: url }); return; }
      window.open(map[net] || map.x, "_blank", "noopener,width=640,height=560");
    });
  });

  /* ---------- Donations ---------- */
  var dw = $("[data-donate]");
  if (dw) {
    var amt = 25, monthly = true, D = C.donate || {};
    var impact = { 10: "covers hosting for 1,000 student visits", 25: "funds one student's scholarship research hour", 50: "adds $50 to next month's scholarship prize", 100: "sponsors a free FAFSA workshop video", 250: "hires a freelance scholarship researcher for a week" };
    function upd() {
      $$(".amt-btn", dw).forEach(function (b) { b.setAttribute("aria-pressed", +b.getAttribute("data-amt") === amt ? "true" : "false"); });
      $$(".toggle button", dw).forEach(function (b) { b.setAttribute("aria-pressed", (b.getAttribute("data-freq") === "monthly") === monthly ? "true" : "false"); });
      var keys = Object.keys(impact).map(Number).filter(function (k) { return k <= amt; }), best = keys.length ? keys[keys.length - 1] : 10;
      set("d-impact", money(amt) + (monthly ? "/month " : " ") + impact[best]);
      set("d-total", money(amt) + (monthly ? " / month" : " one-time"));
      var pa = document.getElementById("pledge-amount"); if (pa) pa.value = money(amt) + (monthly ? " monthly" : " one-time");
    }
    dw.addEventListener("click", function (e) {
      var a = e.target.closest(".amt-btn"), t = e.target.closest(".toggle button"), go = e.target.closest("[data-pay]");
      if (a) { amt = +a.getAttribute("data-amt"); var cu = $("#d-custom"); if (cu) cu.value = ""; upd(); }
      if (t) { monthly = t.getAttribute("data-freq") === "monthly"; upd(); }
      if (go) {
        e.preventDefault(); var m = go.getAttribute("data-pay"), url = m === "stripe" ? (monthly ? D.stripeMonthly : D.stripeOneTime) || D.stripeOneTime : D[m];
        track("donate_click", { method: m, amount: amt, monthly: monthly });
        if (url) window.open(url, "_blank", "noopener");
        else { var pf = document.getElementById("pledge"); if (pf) { pf.classList.remove("hide"); pf.scrollIntoView({ behavior: "smooth", block: "center" }); toast("Online checkout is being set up — send a pledge and we'll reply with a secure link."); } }
      }
    });
    var cu = $("#d-custom"); if (cu) cu.addEventListener("input", function () { var v = parseFloat(cu.value); if (v > 0) { amt = v; upd(); } });
    upd();
  }

  /* ---------- Home quiz personalization ---------- */
  var quiz = $("#funding-quiz");
  if (quiz) quiz.addEventListener("edf:step", function () {
    var who = quiz.querySelector('input[name="I am"]:checked'), out = $("#quiz-hint");
    if (!who || !out) return;
    var hints = { "Student": "We'll match you with scholarships, grants and no-essay awards first.", "Parent": "We'll show savings plans, parent loan options and scholarships for your child.", "Graduate / Refinancing": "We'll compare refinance options and repayment strategies to cut your interest.", "International student": "We'll surface fully funded international scholarships and loans that don't need a US cosigner.", "School / Sponsor": "We'll show you how to fund a named scholarship or reach motivated students." };
    out.textContent = hints[who.value] || "";
  });

  /* ---------- Cookie banner ---------- */
  var ck = $(".cookie");
  if (ck && !store.get("cookie", false)) { setTimeout(function () { ck.classList.add("show"); }, 1200); }
  $$("[data-cookie]").forEach(function (b) { b.addEventListener("click", function () { store.set("cookie", b.getAttribute("data-cookie")); ck.classList.remove("show"); }); });

  /* ---------- Exit-intent lead capture ---------- */
  var modal = $("#exit-modal");
  function openModal() { if (!modal) return; modal.classList.add("show"); store.set("exit_seen", Date.now()); var f = modal.querySelector("input:not(.hp)"); if (f) setTimeout(function () { f.focus(); }, 50); }
  if (modal) {
    var seen = store.get("exit_seen", 0), fresh = Date.now() - seen > 3 * 864e5;
    if (fresh && !document.body.hasAttribute("data-no-exit")) {
      document.addEventListener("mouseout", function h(e) { if (!e.relatedTarget && e.clientY < 8) { openModal(); document.removeEventListener("mouseout", h); } });
      setTimeout(function () { if (!store.get("exit_seen", 0) && matchMedia("(max-width:760px)").matches && scrollY > 1200) openModal(); }, 45000);
    }
    modal.addEventListener("click", function (e) { if (e.target === modal || e.target.closest(".modal-close")) modal.classList.remove("show"); });
  }
  $$("[data-open-modal]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); openModal(); }); });
})();
