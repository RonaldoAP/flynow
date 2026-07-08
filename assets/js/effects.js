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

  /* ─────────── Galeria do hero: troca a imagem principal pelos thumbs ─────────── */
  var galMain = document.getElementById('galMain');
  var galThumbs = Array.prototype.slice.call(document.querySelectorAll('.gal__thumb'));
  function setGalMain(src) {
    if (!galMain || !src) return;
    galMain.src = src;
    galThumbs.forEach(function (t) { t.classList.toggle('is-active', t.dataset.src === src); });
  }
  galThumbs.forEach(function (t) {
    t.addEventListener('click', function () { setGalMain(t.dataset.src); });
  });

  /* ─────────── Seleção de oferta (hero) + espelho na galeria ─────────── */
  var heroOffers = document.querySelector('.hero [data-offers]');
  if (heroOffers && galMain) {
    heroOffers.querySelectorAll('input[type="radio"]').forEach(function (r) {
      r.addEventListener('change', function () {
        if (r.checked && r.dataset.img) setGalMain(r.dataset.img);
      });
    });
  }

  /* ─────────── Checkout (estilo Cellenium): imagem + resumo por oferta ─────────── */
  var checkout = document.querySelector('[data-checkout]');
  if (checkout) {
    var cImg = document.getElementById('checkoutImg');
    var cOff = document.getElementById('checkoutOff');
    var sTotal = document.getElementById('sumTotal');
    var sParcela = document.getElementById('sumParcela');
    var sAvista = document.getElementById('sumAvista');
    function updateCheckout(r) {
      if (cImg && r.dataset.img) cImg.src = r.dataset.img;
      if (cOff) cOff.textContent = r.dataset.off || '';
      if (sTotal && r.dataset.price) sTotal.textContent = 'R$ ' + r.dataset.price;
      if (sParcela) sParcela.textContent = r.dataset.parcela || '';
      if (sAvista) sAvista.textContent = r.dataset.avista || '';
    }
    checkout.querySelectorAll('input[type="radio"]').forEach(function (r) {
      r.addEventListener('change', function () { if (r.checked) updateCheckout(r); });
    });
    var checkedNow = checkout.querySelector('input[type="radio"]:checked');
    if (checkedNow) updateCheckout(checkedNow);
  }

  /* ─────────── Raspe e descubra a oferta (scratch card) ─────────── */
  var scratchEl = document.getElementById('scratch');
  var scratchCanvas = document.getElementById('scratchCover');
  if (scratchEl && scratchCanvas && scratchCanvas.getContext) {
    var sctx = scratchCanvas.getContext('2d');
    var scratchDone = false;
    var pressing = false;
    var cssW = 0, cssH = 0;
    // grade de cobertura: detecta "quanto foi raspado" sem depender de getImageData
    var GRID_COLS = 12, GRID_ROWS = 4;
    var hitCells = {};
    var hitCount = 0;
    var TOTAL_CELLS = GRID_COLS * GRID_ROWS;

    function paintCover(w, h) {
      var g = sctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#8C949E');
      g.addColorStop(0.5, '#C4CBD3');
      g.addColorStop(1, '#98A0AA');
      sctx.globalCompositeOperation = 'source-over';
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, w, h);
      // brilho/pontinhos para textura metálica de "raspadinha"
      sctx.fillStyle = 'rgba(255,255,255,0.18)';
      for (var i = 0; i < 60; i++) {
        var x = ((i * 53) % Math.max(1, Math.floor(w)));
        var y = ((i * 97) % Math.max(1, Math.floor(h)));
        sctx.beginPath();
        sctx.arc(x, y, 1.4, 0, Math.PI * 2);
        sctx.fill();
      }
    }
    function sizeCanvas() {
      if (scratchDone) return;
      var rect = scratchEl.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      cssW = rect.width; cssH = rect.height;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      scratchCanvas.width = Math.round(rect.width * dpr);
      scratchCanvas.height = Math.round(rect.height * dpr);
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintCover(rect.width, rect.height);
      // canvas já pintado: remove a cobertura CSS para que a raspagem revele a oferta
      scratchCanvas.style.background = 'transparent';
    }
    function markCell(x, y) {
      if (!cssW || !cssH) return;
      var col = Math.max(0, Math.min(GRID_COLS - 1, Math.floor(x / cssW * GRID_COLS)));
      var row = Math.max(0, Math.min(GRID_ROWS - 1, Math.floor(y / cssH * GRID_ROWS)));
      var key = row * GRID_COLS + col;
      if (!hitCells[key]) { hitCells[key] = 1; hitCount++; }
    }
    function eraseAt(x, y) {
      sctx.globalCompositeOperation = 'destination-out';
      sctx.beginPath();
      sctx.arc(x, y, 24, 0, Math.PI * 2);
      sctx.fill();
      markCell(x, y);
    }
    function revealPrizes() {
      if (scratchDone) return;
      scratchDone = true;
      scratchEl.classList.add('is-revealed');
      var box = scratchEl.closest('.upsell') || document;
      box.querySelectorAll('.prize').forEach(function (p) { p.classList.remove('is-locked'); });
    }
    function maybeReveal() {
      if (!scratchDone && hitCount / TOTAL_CELLS >= 0.5) revealPrizes();
    }
    function pointFromEvent(e) {
      var rect = scratchCanvas.getBoundingClientRect();
      var t = (e.touches && e.touches[0]) || e;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    function onDown(e) { pressing = true; var p = pointFromEvent(e); eraseAt(p.x, p.y); maybeReveal(); e.preventDefault(); }
    function onMove(e) {
      if (!pressing || scratchDone) return;
      var p = pointFromEvent(e);
      eraseAt(p.x, p.y);
      maybeReveal();
      e.preventDefault();
    }
    function onUp() {
      if (!pressing) return;
      pressing = false;
      maybeReveal();
    }

    scratchCanvas.addEventListener('pointerdown', onDown);
    scratchCanvas.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    // fallback touch (navegadores sem Pointer Events)
    if (!window.PointerEvent) {
      scratchCanvas.addEventListener('touchstart', onDown, { passive: false });
      scratchCanvas.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onUp);
      scratchCanvas.addEventListener('mousedown', onDown);
      scratchCanvas.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    }
    window.addEventListener('resize', sizeCanvas);
    // pinta o quanto antes; a cobertura CSS segura o "flash" até o canvas estar pronto
    sizeCanvas();
    if (document.readyState !== 'complete') window.addEventListener('load', sizeCanvas);
    requestAnimationFrame(sizeCanvas);
    setTimeout(sizeCanvas, 300);
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
