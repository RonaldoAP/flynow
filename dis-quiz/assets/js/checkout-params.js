/* ═══════════════════════════════════════════════
   DIVESSENCE · /dis-quiz — parametros de checkout (Payt)

   Esta pagina recebe trafego de disparo de backend (WhatsApp), nao de
   trafego pago. Por isso ela NAO usa RedTrack: a atribuicao vem inteira
   dos parametros da URL do disparo.

   Fluxo:
     1. captura os parametros da URL e guarda no localStorage;
     2. monta o href do CTA com o produto Payt do kit selecionado
        + os parametros capturados + a identificacao do kit.

   Nomes dos campos conferidos no checkout da Payt (seguro.payt.com.br/a/):
     full_name -> NOME COMPLETO      (pre-preenche)
     email     -> E-MAIL             (pre-preenche)
     phone     -> CELULAR / WHATSAPP (pre-preenche, ja formata)
   O campo de CPF nao aceita pre-preenchimento.
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  var STORAGE_KEY = 'divessenceCheckoutParams';

  /* Parametros aceitos na URL do disparo. utm_content NAO entra aqui:
     ele e reservado para identificar o kit (ver KIT_PARAM). */
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

  /* Parametro que carrega o kit escolhido. O produto da Payt ja identifica
     o kit, mas mandar explicito facilita o relatorio. */
  var KIT_PARAM = 'utm_content';

  /* Se o disparo esquecer o ?src=, a venda ainda chega atribuida. */
  var DEFAULT_SRC = 'dis-quiz';

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

  /* Monta o link final: produto do kit + parametros capturados + kit.
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

  /* Aponta o CTA para a oferta marcada no seu grupo. O href continua sendo
     um href de verdade — nada de preventDefault — para nao quebrar
     abrir-em-nova-aba nem clique com o botao do meio. */
  function syncCheckoutButton(button) {
    var sourceId = button.getAttribute('data-checkout-source');
    var source = sourceId ? document.getElementById(sourceId) : null;
    var offer = source
      ? source.querySelector('input[type="radio"]:checked')
      : null;

    if (!offer || !offer.dataset.link) return;

    button.setAttribute(
      'href',
      buildCheckoutUrl(offer.dataset.link, offer.dataset.kit)
    );
  }

  document.addEventListener('DOMContentLoaded', function () {
    document
      .querySelectorAll('[data-checkout-button]')
      .forEach(function (button) {
        var sourceId = button.getAttribute('data-checkout-source');
        var source = sourceId ? document.getElementById(sourceId) : null;

        if (source) {
          source
            .querySelectorAll('input[type="radio"]')
            .forEach(function (offer) {
              offer.addEventListener('change', function () {
                if (offer.checked) syncCheckoutButton(button);
              });
            });
        }

        syncCheckoutButton(button);
        button.addEventListener('click', function () {
          syncCheckoutButton(button);
        });
      });
  });

  /* Exposto para depuracao no console: CheckoutParams.getSavedParams() */
  window.CheckoutParams = {
    getSavedParams: readStorage,
    buildCheckoutUrl: buildCheckoutUrl
  };
})();
