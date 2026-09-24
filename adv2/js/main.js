(() => {
  'use strict';

  const config = window.ADVERTORIAL_CONFIG || {};
  const safeUrl = (value) => {
    if (!value) return null;
    try {
      const url = new URL(value, location.href);
      return ['https:', 'http:'].includes(url.protocol) ? url : null;
    } catch {
      return null;
    }
  };

  const checkoutSelector = 'a[data-checkout-kit]';
  const validId = (value) => typeof value === 'string' &&
    value.trim() && !/[{}\s]/.test(value) && !/^(undefined|null)$/i.test(value)
    ? value : '';

  const copyMissingParams = (source, destination) => {
    for (const key of new Set(source.keys())) {
      if (key === 'clickid' || key === 'rtkck' || destination.has(key)) continue;
      for (const value of source.getAll(key)) destination.append(key, value);
    }
  };

  function prepareCheckout(link) {
    const kit = link.getAttribute('data-checkout-kit');
    const checkoutUrls = config.checkoutUrls || {};
    if (!Object.prototype.hasOwnProperty.call(checkoutUrls, kit)) return null;
    const destination = safeUrl(checkoutUrls[kit]);
    if (!destination) return null;

    const current = safeUrl(link.href);
    const sameOffer = current && current.origin === destination.origin &&
      current.pathname === destination.pathname;
    const incoming = new URLSearchParams(location.search);
    if (sameOffer) {
      copyMissingParams(current.searchParams, destination.searchParams);
      if (!destination.hash) destination.hash = current.hash;
    }
    copyMissingParams(incoming, destination.searchParams);

    // O ID explícito da visita prevalece sobre IDs antigos no link ou no navegador.
    // track.js expõe rtkClickID também quando registra uma visita após o carregamento.
    const incomingId = validId(incoming.get('rtkcid'));
    const existingIds = sameOffer ? current.searchParams.getAll('clickid') : [];
    const clickId = incomingId || validId(window.rtkClickID) ||
      validId(incoming.get('clickid')) || validId(existingIds[existingIds.length - 1]) ||
      validId(destination.searchParams.get('clickid'));
    if (incomingId) destination.searchParams.set('rtkcid', incomingId);
    if (clickId) {
      destination.searchParams.set('clickid', clickId);
      const cachebusters = sameOffer ? current.searchParams.getAll('rtkck') : [];
      destination.searchParams.set('rtkck', cachebusters[cachebusters.length - 1] ||
        String(Math.floor(Date.now() / 1000)));
    } else {
      destination.searchParams.delete('clickid');
      destination.searchParams.delete('rtkck');
    }

    if (link.href !== destination.href) link.href = destination.href;
    link.classList.add('smartplayer-click-event');
    link.removeAttribute('aria-disabled');
    return destination;
  }

  const prepareCheckouts = () => document.querySelectorAll(checkoutSelector).forEach(prepareCheckout);
  prepareCheckouts();

  // O script oficial varre os links uma vez e concatena os IDs. Normaliza a
  // reescrita dele e prepara ofertas inseridas depois, sem duplicar parâmetros.
  const checkoutObserver = new MutationObserver(prepareCheckouts);
  checkoutObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href', 'data-checkout-kit']
  });

  const localPreview = !['http:', 'https:'].includes(location.protocol) ||
    /^(localhost|0\.0\.0\.0|127(?:\.\d+){3}|\[::1\])$/.test(location.hostname) ||
    location.hostname.endsWith('.localhost');

  function handleCheckoutClick(event) {
    if (event.defaultPrevented || (event.type === 'click' && event.button !== 0) ||
        (event.type === 'auxclick' && event.button !== 1)) return;
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    const link = target?.closest('a.smartplayer-click-event[data-checkout-kit]');
    if (!link) return;
    const destination = prepareCheckout(link);
    const clickId = destination && validId(destination.searchParams.get('clickid'));
    const postback = safeUrl(config.postbackUrl);
    if (localPreview || !clickId || !postback || !config.checkoutEventType ||
        typeof window.fetch !== 'function') return;

    postback.searchParams.set('clickid', clickId);
    postback.searchParams.set('type', config.checkoutEventType);
    // Evento de saída para o checkout; não confirma compra nem resposta do servidor.
    // A navegação segue imediatamente e a resposta opaca não é tratada como sucesso.
    window.fetch(postback.href, { method: 'GET', mode: 'no-cors', keepalive: true }).catch(() => {});
  }

  document.addEventListener('click', handleCheckoutClick, true);
  document.addEventListener('auxclick', handleCheckoutClick, true);

  for (const key of ['privacy', 'terms', 'copyright']) {
    const url = safeUrl(config[`${key}Url`]);
    const label = document.querySelector(`[data-legal="${key}"]`);
    if (url && label) {
      const link = document.createElement('a');
      link.href = url.href;
      link.textContent = label.textContent;
      label.replaceWith(link);
    }
  }

})();
