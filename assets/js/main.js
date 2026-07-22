/* ═══════════════════════════════════════════════
   FLYNOW · GHK-Cu — interações
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Mantém UTMs e rtkcid quando a navegação acontece dentro da própria página. */
  function preserveQueryOnHashLinks() {
    var pathAndQuery = window.location.pathname + window.location.search;

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      link.setAttribute('href', pathAndQuery + hash);
    });
  }

  preserveQueryOnHashLinks();

  /* ── Header shadow on scroll ── */
  var header = document.getElementById('header');
  var buybar = document.getElementById('buybar');

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 12);
    if (buybar) buybar.classList.toggle('is-visible', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Menu mobile ── */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('is-open'); });
    });
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('is-open') &&
          !menu.contains(e.target) && !burger.contains(e.target)) {
        menu.classList.remove('is-open');
      }
    });
  }

  /* ── Acordeões (.acc): abrem/fecham suavemente, vários ao mesmo tempo ── */
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function openAcc(details, body) {
    details.open = true;
    if (prefersReduced) return;
    var target = body.scrollHeight;
    body.style.height = '0px';
    body.style.opacity = '0';
    requestAnimationFrame(function () {
      body.style.height = target + 'px';
      body.style.opacity = '1';
    });
    body.addEventListener('transitionend', function te(ev) {
      if (ev.propertyName !== 'height') return;
      body.style.height = '';
      body.removeEventListener('transitionend', te);
    });
  }

  function closeAcc(details, body) {
    if (prefersReduced) { details.open = false; return; }
    body.style.height = body.scrollHeight + 'px';
    body.style.opacity = '1';
    requestAnimationFrame(function () {
      body.style.height = '0px';
      body.style.opacity = '0';
    });
    body.addEventListener('transitionend', function te(ev) {
      if (ev.propertyName !== 'height') return;
      details.open = false;
      body.style.height = '';
      body.style.opacity = '';
      body.removeEventListener('transitionend', te);
    });
  }

  document.querySelectorAll('.acc').forEach(function (details) {
    var summary = details.querySelector('summary');
    var body = details.querySelector('.acc__body');
    if (!summary || !body) return;
    summary.addEventListener('click', function (e) {
      e.preventDefault();
      if (details.open) closeAcc(details, body);
      else openAcc(details, body);
    });
  });

  /* ── FAQ: animação suave + só um aberto por vez ── */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq__item'));
  faqItems.forEach(function (item) {
    var summary = item.querySelector('summary');
    var body = item.querySelector('.faq__body');
    if (!summary || !body) return;
    summary.addEventListener('click', function (e) {
      e.preventDefault();
      if (item.open) {
        closeAcc(item, body);
      } else {
        faqItems.forEach(function (other) {
          if (other !== item && other.open) closeAcc(other, other.querySelector('.faq__body'));
        });
        openAcc(item, body);
      }
    });
  });

  /* ── Reveal on scroll ── */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
