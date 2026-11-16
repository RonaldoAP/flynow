(() => {
  'use strict';

  const config = window.ADVERTORIAL_CONFIG || {};
  const fallbackOffer = 'https://red.track.divessencebeauty.com.br/preclick';
  const safeUrl = (value) => {
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? url : null;
    } catch {
      return null;
    }
  };
  const offer = safeUrl(config.offerUrl) || new URL(fallbackOffer);
  const incoming = new URLSearchParams(window.location.search);

  document.querySelectorAll('a[data-offer-link]').forEach((link) => {
    const destination = new URL(offer.href);
    const current = safeUrl(link.href);
    // Preserva parâmetros do destino e a atribuição já adicionada pelo pretrack.
    if (current && current.origin === offer.origin && current.pathname === offer.pathname) {
      for (const key of new Set(current.searchParams.keys())) {
        if (destination.searchParams.has(key)) continue;
        for (const value of current.searchParams.getAll(key)) destination.searchParams.append(key, value);
      }
    }
    for (const key of new Set(incoming.keys())) {
      // A integração oficial determina esses valores. Copiar os da entrada os duplicaria.
      if (key === 'clickid' || key === 'rtkck' || destination.searchParams.has(key)) continue;
      for (const value of incoming.getAll(key)) destination.searchParams.append(key, value);
    }
    link.href = destination.href;
  });
})();
