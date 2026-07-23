(function () {
  'use strict';

  function preservePageParams(link) {
    var destination = new URL(link.getAttribute('href'), window.location.href);
    var currentParams = new URLSearchParams(window.location.search);

    currentParams.forEach(function (value, key) {
      if (!destination.searchParams.has(key)) {
        destination.searchParams.append(key, value);
      }
    });

    link.setAttribute('href', destination.toString());
  }

  document.addEventListener('DOMContentLoaded', function () {
    var checkoutButtons = document.querySelectorAll(
      '[data-kit-checkout].smartplayer-click-event'
    );
    var urlParams = new URLSearchParams(window.location.search);
    var clickid = urlParams.get('rtkcid');

    checkoutButtons.forEach(function (button) {
      preservePageParams(button);

      button.addEventListener('click', function () {
        var card = button.closest('.ocard');
        var offer = card ? card.querySelector('input[type="radio"]') : null;

        if (offer && !offer.checked) {
          offer.checked = true;
          offer.dispatchEvent(new Event('change', { bubbles: true }));
        }
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
