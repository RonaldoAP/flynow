/* ═══════════════════════════════════════════════
   DIVESSENCE · GHK-Cu — efeitos de scroll & carrossel
   Lenis smooth scroll · scroll blur · depoimentos ·
   scrollytelling (timeline) · galeria scroll-reveal
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────── Lenis smooth scroll ─────────── */
  var lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Âncoras internas usam o scroll suave do Lenis
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      });
    });
  }

  // Fonte única de "scrollY" (Lenis ou nativo)
  function onScroll(cb) {
    if (lenis) lenis.on('scroll', cb);
    window.addEventListener('scroll', cb, { passive: true });
  }

  /* ─────────── Moléculas flutuantes: parallax ao rolar ─────────── */
  var molecules = Array.prototype.slice.call(document.querySelectorAll('.molecule'));
  if (molecules.length && !reduce) {
    var molData = molecules.map(function (m) {
      return { el: m, sec: m.closest('section'), amp: parseFloat(m.dataset.speed || '120') };
    });
    function molParallax() {
      var vh = window.innerHeight;
      molData.forEach(function (d) {
        var rect = d.sec.getBoundingClientRect();
        // progresso: 0 quando a seção entra pela base, 1 quando sai pelo topo
        var prog = (vh - rect.top) / (vh + rect.height);
        prog = Math.max(0, Math.min(1, prog));
        d.el.style.setProperty('--pY', ((0.5 - prog) * d.amp).toFixed(1) + 'px');
      });
    }
    onScroll(molParallax);
    window.addEventListener('resize', molParallax);
    molParallax();
  }

  /* ─────────── Depoimentos: carrossel auto + setas ─────────── */
  var track = document.getElementById('revTrack');
  if (track) {
    var originals = Array.prototype.slice.call(track.children);
    var count = originals.length;
    // clona os cards para permitir loop infinito sem espaços vazios
    originals.forEach(function (c) { track.appendChild(c.cloneNode(true)); });
    var index = 0;
    var timer = null;

    function stepPx() {
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.columnGap || style.gap || '24') || 24;
      var w = originals[0].getBoundingClientRect().width;
      if (!w) { w = (track.parentElement.getBoundingClientRect().width || 0); } // fallback
      return w + gap;
    }
    function apply(withTransition) {
      track.style.transition = withTransition ? '' : 'none';
      track.style.transform = 'translateX(' + (-stepPx() * index) + 'px)';
    }
    function next() { index++; apply(true); }
    function prev() {
      if (index <= 0) { index = count; apply(false); void track.offsetWidth; }
      index--; apply(true);
    }
    // ao terminar a transição, reseta os clones sem "trancar" nada
    track.addEventListener('transitionend', function (e) {
      if (e.propertyName !== 'transform') return;
      if (index >= count) { index -= count; apply(false); }
      else if (index < 0) { index += count; apply(false); }
    });

    function startAuto() { stopAuto(); timer = setInterval(next, 5000); }
    function stopAuto() { if (timer) clearInterval(timer); }

    document.querySelectorAll('[data-rev]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.getAttribute('data-rev') === 'next') next(); else prev();
        startAuto();
      });
    });

    var revWrap = track.closest('.reviews');
    if (revWrap) {
      revWrap.addEventListener('mouseenter', stopAuto);
      revWrap.addEventListener('mouseleave', startAuto);
    }
    window.addEventListener('resize', function () { apply(false); });
    apply(false);
    startAuto();
  }

  /* ─────────── Timeline: pin no desktop (1 etapa/scroll) · empilhada no mobile ─────────── */
  var pinTrack = document.getElementById('scrolly');
  if (pinTrack) {
    var steps = Array.prototype.slice.call(pinTrack.querySelectorAll('.sstep'));
    var nodes = Array.prototype.slice.call(pinTrack.querySelectorAll('.tline__node'));
    var railFill = pinTrack.querySelector('.tline__rail-line i');
    var N = steps.length;
    var current = -1;
    var desktop = window.matchMedia('(min-width: 981px)');

    function setActive(idx) {
      if (idx === current) return;
      current = idx;
      steps.forEach(function (s) { s.classList.toggle('is-active', +s.dataset.step === idx); });
      nodes.forEach(function (n) { n.classList.toggle('is-active', +n.dataset.step <= idx); });
      if (railFill) railFill.style.height = (N > 1 ? (idx / (N - 1)) * 100 : 0) + '%';
    }

    // Desktop: índice pela progressão do scroll dentro do trilho alto (pin)
    function updatePin() {
      var rect = pinTrack.getBoundingClientRect();
      var scrollable = pinTrack.offsetHeight - window.innerHeight;
      var p = scrollable > 0 ? (-rect.top) / scrollable : 0;
      p = Math.max(0, Math.min(0.9999, p));
      setActive(Math.min(N - 1, Math.floor(p * N)));
    }

    // Mobile: todas as etapas visíveis, ativa destaca ao entrar na tela
    var io = null;
    function enableObserver() {
      if (io || !('IntersectionObserver' in window)) return;
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) setActive(+en.target.dataset.step); });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      steps.forEach(function (s) { io.observe(s); });
    }
    function disableObserver() { if (io) { io.disconnect(); io = null; } }

    function mode() {
      if (desktop.matches) { disableObserver(); onScroll(updatePin); window.addEventListener('resize', updatePin); updatePin(); }
      else { enableObserver(); }
    }
    mode();
    if (desktop.addEventListener) desktop.addEventListener('change', function () { current = -1; mode(); });
  }

  /* ─────────── Galeria scroll-reveal pinada (centro → 33/34/33) ─────────── */
  var gallery = document.getElementById('gallery');
  if (gallery && !reduce) {
    var setProgress = function () {
      var vh = window.innerHeight;
      var start = gallery.offsetTop;
      var len = gallery.offsetHeight - vh;      // distância de scroll dentro do pin
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var p = (y - start) / (len || 1);
      p = Math.max(0, Math.min(1, p));
      gallery.style.setProperty('--p', p.toFixed(4));
    };
    onScroll(setProgress);
    window.addEventListener('resize', setProgress);
    setProgress();
  }
})();
