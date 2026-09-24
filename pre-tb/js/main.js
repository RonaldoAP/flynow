(() => {
  'use strict';

  const config = window.ADVERTORIAL_CONFIG || {};
  const selector = 'a[data-offer-link]';
  const incoming = new URLSearchParams(location.search);
  const attributionKeys = new Set(['rtkcid', 'clickid', 'rtkck']);

  function safeUrl(value) {
    if (!value) return null;
    try {
      const url = new URL(value, location.href);
      return ['https:', 'http:'].includes(url.protocol) ? url : null;
    } catch {
      return null;
    }
  }

  const validId = (value) => typeof value === 'string' && value.trim() &&
    !/[{}\s]/.test(value) && !/^(undefined|null)$/i.test(value) ? value : '';

  function copyMissingParams(source, destination) {
    for (const key of new Set(source.keys())) {
      if (!attributionKeys.has(key) && !destination.has(key)) {
        destination.set(key, source.get(key));
      }
    }
  }

  function prepareLink(link) {
    const current = safeUrl(link.href);
    const destination = safeUrl(config.offerUrl || link.href);
    if (!destination) return;

    // Mantém parâmetros próprios do destino e da visita sem concatenar chaves.
    if (current && current.origin === destination.origin &&
        current.pathname === destination.pathname) {
      copyMissingParams(current.searchParams, destination.searchParams);
    }
    copyMissingParams(incoming, destination.searchParams);

    // pretrack.js usa rtkcid da URL ou expõe o ID da visita recém-registrada.
    // Nunca recupera IDs de cookies, armazenamento ou links de visitas antigas.
    const incomingId = validId(incoming.get('rtkcid'));
    const clickId = incomingId || validId(window.rtkClickID) ||
      validId(incoming.get('clickid'));
    for (const key of attributionKeys) destination.searchParams.delete(key);
    if (incomingId) destination.searchParams.set('rtkcid', incomingId);
    if (clickId) {
      destination.searchParams.set('clickid', clickId);
      const cachebuster = Number(window.cachebuster);
      destination.searchParams.set('rtkck', String(
        Number.isFinite(cachebuster) && cachebuster > 0
          ? cachebuster : Math.floor(Date.now() / 1000)
      ));
    }

    if (link.href !== destination.href) link.href = destination.href;
  }

  const prepareLinks = () => document.querySelectorAll(selector).forEach(prepareLink);
  prepareLinks();

  // A integração oficial varre links uma vez e concatena clickid/rtkck.
  // Normaliza essa atualização e cobre imagens/CTAs inseridos posteriormente.
  const observer = new MutationObserver(prepareLinks);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href', 'data-offer-link']
  });

  function prepareActivatedLink(event) {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    const link = target?.closest(selector);
    if (link) prepareLink(link);
  }
  // O click cobre teclado; auxclick e contextmenu cobrem novas abas.
  for (const eventName of ['click', 'auxclick', 'contextmenu']) {
    document.addEventListener(eventName, prepareActivatedLink, true);
  }

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
