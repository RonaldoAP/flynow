/* ═══════════════════════════════════════════════
   DIVESSENCE · Black Friday — parametros de checkout (Payt)
   Mesma logica do /backend (flynow/backend/assets/js/checkout-params.js).

   Fluxo:
     1. captura os parametros da URL e guarda no localStorage;
     2. monta o href de todos os CTAs (.js-checkout) com o link da Payt
        + os parametros capturados + a identificacao da oferta.

   Campos do checkout da Payt (seguro.payt.com.br/a/):
     full_name -> NOME COMPLETO      (pre-preenche)
     email     -> E-MAIL             (pre-preenche)
     phone     -> CELULAR / WHATSAPP (pre-preenche, ja formata)
   O campo de CPF nao aceita pre-preenchimento.

   Exemplo de URL:
     /?src=SUA-CAMPANHA&utm_source=whatsapp&full_name=Maria%20Silva&email=maria@email.com&phone=11988887777
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Link do produto na Payt — oferta "Compre 1 e leve 2". */
  var CHECKOUT_LINK = 'https://checkout.payt.com.br/4bb1934d0c4276bc17295e391b9dea81';

  /* Identifica a oferta no relatorio (vai em utm_content). */
  var OFFER_KIT = 'bf-compre1leve2';

  /* Chave propria para nao misturar com a origem guardada pelo /backend. */
  var STORAGE_KEY = 'divessenceBFCheckoutParams';

  /* Parametros aceitos na URL. utm_content NAO entra aqui:
     ele e reservado para identificar a oferta (ver KIT_PARAM). */
  var TRACKED_PARAMS = [
    'src',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'fbclid',
    'gclid',
    'full_name',
    'email',
    'phone'
  ];

  var KIT_PARAM = 'utm_content';

  /* Se a URL vier sem ?src=, a venda ainda chega atribuida. */
  var DEFAULT_SRC = 'blackfriday1';

  function readStorage() {
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function writeStorage(data) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      /* aba anonima ou storage cheio — o fluxo segue com os params da URL */
    }
  }

  /* Le a URL atual e mescla no que ja estava guardado. A URL sempre vence,
     porque e a informacao mais recente sobre a origem da visita. */
  function captureParams() {
    var urlParams = new URLSearchParams(window.location.search);
    var saved = readStorage();

    TRACKED_PARAMS.forEach(function (key) {
      var value = urlParams.get(key);
      if (value && value.trim() !== '') saved[key] = value.trim();
    });

    if (!saved.src) saved.src = DEFAULT_SRC;

    writeStorage(saved);
    return saved;
  }

  var params = captureParams();

  /* Monta o link final: produto + parametros capturados + oferta.
     Um parametro que ja exista no link do produto (ex.: split) e preservado. */
  function buildCheckoutUrl(productLink, kit) {
    var url = new URL(productLink, window.location.href);

    Object.keys(params).forEach(function (key) {
      if (params[key] && !url.searchParams.has(key)) {
        url.searchParams.set(key, params[key]);
      }
    });

    if (kit) url.searchParams.set(KIT_PARAM, kit);

    return url.toString();
  }

  /* O href continua sendo um href de verdade — nada de preventDefault —
     para nao quebrar abrir-em-nova-aba nem clique com o botao do meio.
     Enquanto CHECKOUT_LINK estiver vazio, os botoes ficam inertes. */
  function syncButtons() {
    document.querySelectorAll('.js-checkout').forEach(function (button) {
      if (CHECKOUT_LINK) {
        button.setAttribute('href', buildCheckoutUrl(CHECKOUT_LINK, OFFER_KIT));
      } else if (!button.dataset.placeholder) {
        button.dataset.placeholder = '1';
        button.addEventListener('click', function (e) { e.preventDefault(); });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncButtons);
  } else {
    syncButtons();
  }

  /* Exposto para depuracao no console: CheckoutParams.getSavedParams() */
  window.CheckoutParams = {
    getSavedParams: readStorage,
    buildCheckoutUrl: buildCheckoutUrl
  };
})();
