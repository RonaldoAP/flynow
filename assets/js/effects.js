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
    var animating = false;

    function stepPx() {
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.columnGap || style.gap || '24') || 24;
      return originals[0].getBoundingClientRect().width + gap;
    }
    function apply(withTransition) {
      track.style.transition = withTransition ? '' : 'none';
      track.style.transform = 'translateX(' + (-stepPx() * index) + 'px)';
    }
    function next() {
      if (animating) return;
      animating = true;
      index++;
      apply(true);
    }
    function prev() {
      if (animating) return;
      animating = true;
      if (index <= 0) {                 // salta pro clone equivalente e volta suave
        index = count;
        apply(false);
        // força reflow antes de animar
        void track.offsetWidth;
      }
      index--;
      apply(true);
    }
    track.addEventListener('transitionend', function (e) {
      if (e.propertyName !== 'transform') return;
      animating = false;
      if (index >= count) {             // chegou nos clones → reseta sem transição
        index = 0;
        apply(false);
      }
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

  /* ─────────── Timeline: destaca a etapa ativa + preenche a linha ─────────── */
  var tline = document.getElementById('scrollySteps');
  if (tline) {
    var steps = Array.prototype.slice.call(tline.querySelectorAll('.sstep'));
    var lineFill = tline.querySelector('.tline__line i');

    function setActive(idx) {
      steps.forEach(function (s) { s.classList.toggle('is-active', +s.dataset.step === idx); });
      if (lineFill) {
        var node = steps[idx].querySelector('.sstep__node');
        var wrapTop = tline.getBoundingClientRect().top;
        var nr = node.getBoundingClientRect();
        lineFill.style.height = (nr.top + nr.height / 2 - wrapTop) + 'px';
      }
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
