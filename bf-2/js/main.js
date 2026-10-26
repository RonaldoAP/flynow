/* Divessence — Black Friday (link do checkout: js/checkout-params.js) */

(function () {
  'use strict';
  document.documentElement.classList.add('js');

  // ---------- Relatos passando (duplica os cards para o loop infinito) ----------
  document.querySelectorAll('[data-marquee]').forEach(function (m) {
    var track = m.querySelector('.marquee__track');
    Array.prototype.slice.call(track.children).forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    m.addEventListener('touchstart', function () { m.classList.add('is-paused'); }, { passive: true });
    m.addEventListener('touchend', function () { m.classList.remove('is-paused'); });
  });

  // ---------- Setas dos carrosséis ----------
  document.querySelectorAll('[data-arrows]').forEach(function (group) {
    var slider = document.getElementById(group.getAttribute('data-arrows'));
    if (!slider) return;
    group.querySelectorAll('.arrow').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = slider.firstElementChild;
        var step = card ? card.getBoundingClientRect().width + 14 : 300;
        slider.scrollBy({ left: step * Number(btn.getAttribute('data-dir')), behavior: 'smooth' });
      });
    });
  });

  // ---------- Vídeos: tocam mudos quando aparecem ----------
  var videos = document.querySelectorAll('.video-card video');
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.play().catch(function () {}); }
        else { en.target.pause(); }
      });
    }, { threshold: 0.6 });
    videos.forEach(function (v) { vio.observe(v); });
  }
  document.querySelectorAll('.video-card__sound').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var v = btn.parentElement.querySelector('video');
      var turnOn = v.muted;
      videos.forEach(function (o) { o.muted = true; });
      document.querySelectorAll('.video-card__sound').forEach(function (b) { b.classList.remove('is-on'); });
      v.muted = !turnOn;
      if (turnOn) { btn.classList.add('is-on'); v.play().catch(function () {}); }
      btn.setAttribute('aria-label', turnOn ? 'Desativar som' : 'Ativar som');
    });
  });

  // ---------- Linha do tempo: preenche conforme a rolagem ----------
  var timeline = document.querySelector('[data-timeline]');
  var steps = timeline ? timeline.querySelectorAll('.tl-step') : [];
  var fill;
  if (timeline) {
    fill = document.createElement('span');
    fill.className = 'timeline__fill';
    timeline.appendChild(fill);
  }

  // ---------- CTA fixo no mobile ----------
  var sticky = document.querySelector('[data-sticky]');
  var hero = document.querySelector('.hero');
  var footer = document.querySelector('.footer');

  var ticking = false;
  function onScroll() {
    var vh = window.innerHeight;
    if (timeline) {
      var r = timeline.getBoundingClientRect();
      var progress = Math.min(Math.max((vh * 0.6 - r.top) / r.height, 0), 1);
      fill.style.height = (progress * (r.height - 16)) + 'px';
      steps.forEach(function (s) {
        s.classList.toggle('is-active', s.getBoundingClientRect().top < vh * 0.6);
      });
    }
    if (sticky && hero) {
      var pastHero = hero.getBoundingClientRect().bottom < 0;
      var atFooter = footer && footer.getBoundingClientRect().top < vh;
      sticky.classList.toggle('is-visible', pastHero && !atFooter);
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  // ---------- Revelar seções ao rolar ----------
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var targets = document.querySelectorAll('.section__title, .display, .product-card, .tl-step, .ritual-card, .quality__media, .quality__list li, .story__media, .checklist, .guarantee__card');
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); rio.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (t) { t.classList.add('reveal'); rio.observe(t); });
  }
})();
