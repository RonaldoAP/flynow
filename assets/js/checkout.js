(function () {
  'use strict';

  function preservePageParams(link, trackedParams) {
    var destination = new URL(link.getAttribute('href'), window.location.href);
    var currentParams = new URLSearchParams(window.location.search);

    [currentParams, trackedParams].forEach(function (params) {
      if (!params) return;
      params.forEach(function (value, key) {
        if (!destination.searchParams.has(key)) {
          destination.searchParams.append(key, value);
        }
      });
    });

    link.setAttribute('href', destination.toString());
  }

  function syncSelectedCheckout(button) {
    var sourceId = button.getAttribute('data-checkout-source');
    var source = sourceId ? document.getElementById(sourceId) : null;
    var offer = source
      ? source.querySelector('input[type="radio"]:checked')
      : null;

    if (!offer || !offer.dataset.link) return null;

    var trackedParams = new URL(button.href, window.location.href).searchParams;
    button.setAttribute('href', offer.dataset.link);
    preservePageParams(button, trackedParams);
    return offer;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var checkoutButtons = document.querySelectorAll(
      '[data-checkout-button].smartplayer-click-event'
    );
    var urlParams = new URLSearchParams(window.location.search);
    var clickid = urlParams.get('rtkcid');

    checkoutButtons.forEach(function (button) {
      var sourceId = button.getAttribute('data-checkout-source');
      var source = sourceId ? document.getElementById(sourceId) : null;

      if (source) {
        source.querySelectorAll('input[type="radio"]').forEach(function (offer) {
          offer.addEventListener('change', function () {
            if (offer.checked) syncSelectedCheckout(button);
          });
        });
      }

      syncSelectedCheckout(button);

      button.addEventListener('click', function () {
        syncSelectedCheckout(button);
      });

      if (clickid) {
        button.addEventListener('click', function (event) {
          event.stopPropagation();

          var postbackURL =
            'https://red.track.divessencebeauty.com.br/postback?clickid=' +
            encodeURIComponent(clickid) +
            '&type=InitiateCheckout';

          fetch(postbackURL, {
            method: 'GET',
            keepalive: true
          })
            .then(function (response) {
              console.log(
                'Conversão InitiateCheckout disparada para ClickID:',
                clickid,
                response
              );
            })
            .catch(function (error) {
              console.error(
                'Erro ao disparar conversão InitiateCheckout:',
                error
              );
            });
        });
      }
    });

    if (clickid) {
      console.log('ClickID encontrado:', clickid);
    } else {
      console.warn(
        'ClickID (rtkcid) não encontrado na URL. Conversão não será disparada.'
      );
    }
  });
})();
