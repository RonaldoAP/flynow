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
    var cards = Array.prototype.slice.call(track.children);
    var index = 0;
    var timer = null;

    function visibleCount() { return window.innerWidth <= 720 ? 1 : 2; }
    function maxIndex() { return Math.max(0, cards.length - visibleCount()); }

    function go(i) {
      index = i > maxIndex() ? 0 : (i < 0 ? maxIndex() : i);
      var card = cards[0];
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.columnGap || style.gap || '20') || 20;
      var step = card.getBoundingClientRect().width + gap;
      track.style.transform = 'translateX(' + (-step * index) + 'px)';
    }
    function next() { go(index + 1); }
    function prev() { go(index - 1); }

    function startAuto() {
      stopAuto();
      timer = setInterval(next, 5000);
    }
    function stopAuto() { if (timer) clearInterval(timer); }

    document.querySelectorAll('[data-rev]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.getAttribute('data-rev') === 'next') next(); else prev();
        startAuto(); // reinicia o timer ao interagir
      });
    });

    var revWrap = track.closest('.reviews');
    if (revWrap) {
      revWrap.addEventListener('mouseenter', stopAuto);
      revWrap.addEventListener('mouseleave', startAuto);
    }
    window.addEventListener('resize', function () { go(index); });
    go(0);
    startAuto();
  }

  /* ─────────── Timeline por etapas (fixa/pinned): 1 semana por vez ─────────── */
  var track = document.getElementById('scrolly');
  if (track) {
    var steps = Array.prototype.slice.call(track.querySelectorAll('.sstep'));
    var nodes = Array.prototype.slice.call(track.querySelectorAll('.tline__node'));
    var railFill = track.querySelector('.tline__rail-line i');
    var N = steps.length;
    var current = -1;

    function setActive(idx) {
      if (idx === current) return;
      current = idx;
      steps.forEach(function (s) { s.classList.toggle('is-active', +s.dataset.step === idx); });
      nodes.forEach(function (n) { n.classList.toggle('is-active', +n.dataset.step <= idx); });
      if (railFill) railFill.style.height = (N > 1 ? (idx / (N - 1)) * 100 : 0) + '%';
    }

    function update() {
      var rect = track.getBoundingClientRect();
      var scrollable = track.offsetHeight - window.innerHeight;
      var p = scrollable > 0 ? (-rect.top) / scrollable : 0;
      p = Math.max(0, Math.min(0.9999, p));
      setActive(Math.min(N - 1, Math.floor(p * N)));
    }
    onScroll(update);
    window.addEventListener('resize', update);
    update();
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
