/* OCAI Solutions — premium motion engine
   Vanilla JS, no dependencies. Honors prefers-reduced-motion. */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (REDUCED || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute('data-reveal-delay');
          if (delay) entry.target.style.transitionDelay = delay + 'ms';
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (REDUCED) return;
    var els = document.querySelectorAll('[data-magnetic]');
    els.forEach(function (el) {
      var strength = parseFloat(el.getAttribute('data-magnetic-strength')) || 0.35;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + (x * strength) + 'px, ' + (y * strength) + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ---------- Counter ---------- */
  function initCounters() {
    var els = document.querySelectorAll('[data-counter]');
    if (!els.length) return;
    function animate(el) {
      var target = parseFloat(el.getAttribute('data-counter')) || 0;
      var duration = parseInt(el.getAttribute('data-counter-duration'), 10) || 1400;
      var prefix = el.getAttribute('data-counter-prefix') || '';
      var suffix = el.getAttribute('data-counter-suffix') || '';
      var decimals = parseInt(el.getAttribute('data-counter-decimals'), 10) || 0;
      var start = performance.now();
      function tick(t) {
        var p = Math.min(1, (t - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        var v = target * eased;
        el.textContent = prefix + v.toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    if (REDUCED || !('IntersectionObserver' in window)) {
      els.forEach(function (el) {
        var target = parseFloat(el.getAttribute('data-counter')) || 0;
        var prefix = el.getAttribute('data-counter-prefix') || '';
        var suffix = el.getAttribute('data-counter-suffix') || '';
        el.textContent = prefix + target + suffix;
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Aurora canvas (hero background) ----------
     Lightweight blob-blur animated mesh. Uses 2D canvas, not WebGL.
     Renders only when visible; respects reduced motion. */
  function initAurora() {
    var canvas = document.querySelector('canvas[data-aurora]');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, raf = 0, visible = true, t = 0;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * DPR; canvas.height = h * DPR;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    // All-warm OC sunset palette — amber, coral, gold, rose. No cold accents.
    var blobs = [
      { x: 0.18, y: 0.20, r: 0.55, color: 'rgba(245,158,11,0.55)', sx: 0.00018, sy: 0.00013 },  // amber
      { x: 0.80, y: 0.30, r: 0.50, color: 'rgba(249,115,22,0.48)', sx: -0.00022, sy: 0.00018 }, // orange
      { x: 0.55, y: 0.85, r: 0.60, color: 'rgba(252,211,77,0.38)', sx: 0.00012, sy: -0.00020 }, // gold
      { x: 0.30, y: 0.75, r: 0.45, color: 'rgba(251,146,60,0.32)', sx: -0.00016, sy: -0.00010 },// coral
      { x: 0.90, y: 0.85, r: 0.45, color: 'rgba(248,113,113,0.22)', sx: 0.00020, sy: -0.00014 } // rose
    ];

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      blobs.forEach(function (b) {
        var cx = (b.x + Math.sin(t * b.sx) * 0.08) * w;
        var cy = (b.y + Math.cos(t * b.sy) * 0.08) * h;
        var r = b.r * Math.max(w, h);
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, b.color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });
      ctx.globalCompositeOperation = 'source-over';
    }

    function loop(now) {
      t = now || 0;
      if (visible) draw();
      raf = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener('resize', resize);
    if (REDUCED) { draw(); return; }
    if ('IntersectionObserver' in window) {
      var vo = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }, { threshold: 0.01 });
      vo.observe(canvas);
    }
    raf = requestAnimationFrame(loop);
  }

  /* ---------- Pointer glow follow ---------- */
  function initSpotlight() {
    if (REDUCED) return;
    var els = document.querySelectorAll('[data-spotlight]');
    els.forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--sx', ((e.clientX - r.left) / r.width * 100) + '%');
        el.style.setProperty('--sy', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  /* ---------- Tilt cards ---------- */
  function initTilt() {
    if (REDUCED) return;
    var els = document.querySelectorAll('[data-tilt]');
    els.forEach(function (el) {
      var max = parseFloat(el.getAttribute('data-tilt-max')) || 6;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -2 * max;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 2 * max;
        el.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
      });
    });
  }

  /* ---------- Headline split-letter intro ---------- */
  function initSplit() {
    var els = document.querySelectorAll('[data-split]');
    if (!els.length) return;
    els.forEach(function (el) {
      if (el.dataset.splitDone) return;
      var text = el.textContent;
      el.textContent = '';
      var i = 0;
      text.split(/(\s+)/).forEach(function (word) {
        if (/^\s+$/.test(word)) { el.appendChild(document.createTextNode(' ')); return; }
        var span = document.createElement('span');
        span.className = 'split-word';
        span.style.transitionDelay = (i * 60) + 'ms';
        span.textContent = word;
        el.appendChild(span);
        i++;
      });
      el.dataset.splitDone = '1';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { el.classList.add('split-in'); });
      });
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  function initMobileNav() {
    var btn = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-nav]');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    initReveal();
    initMagnetic();
    initCounters();
    initSpotlight();
    initTilt();
    initSplit();
    initAurora();
    initMobileNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
