/* Link de saida do quiz: mesma logica do adv-6 (preclick do RedTrack + parametros de entrada).
   O pretrack.js do RedTrack acrescenta clickid/rtkck a este link; o botao final do quiz navega para ele. */
(() => {
  'use strict';
  const OFFER = 'https://red.track.divessencebeauty.com.br/preclick';
  if (document.getElementById('dv-offer')) return;
  const destination = new URL(OFFER);
  const incoming = new URLSearchParams(window.location.search);
  for (const key of new Set(incoming.keys())) {
    // A integracao oficial determina esses valores. Copiar os da entrada os duplicaria.
    if (key === 'clickid' || key === 'rtkck' || destination.searchParams.has(key)) continue;
    for (const value of incoming.getAll(key)) destination.searchParams.append(key, value);
  }
  const link = document.createElement('a');
  link.id = 'dv-offer';
  link.href = destination.href;
  link.hidden = true;
  link.setAttribute('aria-hidden', 'true');
  link.tabIndex = -1;
  document.body.appendChild(link);
})();
