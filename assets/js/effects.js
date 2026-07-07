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

  /* ─────────── Scroll blur (névoa na base) ─────────── */
  var blur = document.getElementById('scrollBlur');
  if (blur) {
    var blurTimer = null;
    onScroll(function () {
      blur.classList.add('is-active');
      if (blurTimer) clearTimeout(blurTimer);
      blurTimer = setTimeout(function () { blur.classList.remove('is-active'); }, 220);
    });
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

  /* ─────────── Scrollytelling: troca de foto por semana ─────────── */
  var scrolly = document.getElementById('scrolly');
  if (scrolly) {
    var steps = scrolly.querySelectorAll('.sstep');
    var imgs = scrolly.querySelectorAll('.scrolly__img');
    var numEl = document.getElementById('scrollyNum');

    function setActive(idx) {
      steps.forEach(function (s) { s.classList.toggle('is-active', +s.dataset.step === idx); });
      imgs.forEach(function (im) { im.classList.toggle('is-active', +im.dataset.step === idx); });
      if (numEl) numEl.textContent = ('0' + (idx + 1)).slice(-2);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) setActive(+en.target.dataset.step);
        });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      steps.forEach(function (s) { io.observe(s); });
    }
  }

  /* ─────────── Galeria scroll-reveal (centro → laterais) ─────────── */
  var gallery = document.getElementById('gallery');
  if (gallery && !reduce) {
    var setProgress = function () {
      var rect = gallery.getBoundingClientRect();
      var vh = window.innerHeight;
      // progresso de 0 (entrando) a 1 (centralizado)
      var p = 1 - Math.max(0, Math.min(1, (rect.top + rect.height * 0.1) / vh));
      p = Math.max(0, Math.min(1, p * 1.15));
      gallery.style.setProperty('--p', p.toFixed(3));
    };
    onScroll(setProgress);
    window.addEventListener('resize', setProgress);
    setProgress();
  }
})();
