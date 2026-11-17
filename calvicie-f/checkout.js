/* Divessence · páginas de calvície — checkout direto na Payt (mesma lógica da /backend e da /pv3-ghk-ml2).
   1. captura src, UTMs e demais parâmetros da URL e guarda no navegador;
   2. o botão de compra leva ao produto Payt do kit escolhido + parâmetros + kit;
   3. sem ?src= na URL, a venda chega com o src padrão desta página (data-default-src no <body>). */
(function () {
  'use strict';

  var STORAGE_KEY = 'divessenceCalvicieCheckoutParams';
  var DEFAULT_SRC = document.body.getAttribute('data-default-src') || 'calvicie';
  var TRACKED = ['src', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'fbclid', 'gclid', 'full_name', 'email', 'phone', 'rtkcid', 'clickid'];

  function capture() {
    var url = new URLSearchParams(window.location.search);
    var saved = {};
    try { saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { saved = {}; }
    // Uma origem nova começa uma visita nova, sem misturar com a anterior.
    if (['src', 'utm_source', 'utm_campaign', 'rtkcid', 'clickid'].some(function (k) { return url.has(k); })) saved = {};
    TRACKED.forEach(function (k) {
      var v = url.get(k);
      if (v && v.trim() !== '') saved[k] = v.trim();
    });
    if (!saved.src) saved.src = DEFAULT_SRC;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch (e) { /* segue sem salvar */ }
    return saved;
  }

  var params = capture();

  function buildUrl(link, kit) {
    var u = new URL(link, window.location.href);
    Object.keys(params).forEach(function (k) {
      if (k === 'utm_content') return;
      if (!u.searchParams.has(k)) u.searchParams.set(k, params[k]);
    });
    // Mantém o utm_content do anúncio quando existir; senão, identifica o kit.
    u.searchParams.set('utm_content', params.utm_content || kit);
    u.searchParams.set('kit', kit);
    return u.toString();
  }

  function selected() {
    return document.querySelector('input[name="kit"]:checked');
  }

  function sync() {
    var opt = selected();
    if (!opt) return;
    var href = buildUrl(opt.dataset.link, opt.dataset.kit);
    document.querySelectorAll('[data-buy]').forEach(function (a) { a.setAttribute('href', href); });
    var set = function (sel, val) { document.querySelectorAll(sel).forEach(function (el) { el.textContent = val; }); };
    set('[data-sum-parc]', opt.dataset.parcela);
    set('[data-sum-vista]', 'ou R$ ' + opt.dataset.price + ' à vista');
    set('[data-sum-total]', 'R$ ' + opt.dataset.price);
    set('[data-sum-name]', opt.dataset.name);
  }

  document.querySelectorAll('input[name="kit"]').forEach(function (r) { r.addEventListener('change', sync); });
  // Botões fora da área de compra rolam até os kits e também levam o link certo.
  document.querySelectorAll('[data-buy]').forEach(function (a) { a.addEventListener('click', sync); });
  sync();

  // Barra fixa no celular quando a área de compra sai da tela.
  var sticky = document.querySelector('.sticky');
  var buyBox = document.getElementById('comprar');
  if (sticky && buyBox && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      sticky.classList.toggle('is-on', !e.isIntersecting && e.boundingClientRect.top < 0 && window.innerWidth < 900);
    }).observe(buyBox);
  }

  window.CheckoutParams = { getSavedParams: function () { return Object.assign({}, params); } };
})();
