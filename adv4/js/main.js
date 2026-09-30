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

  const countdowns = [...document.querySelectorAll('[data-countdown]')];
  if (!countdowns.length) return;
  countdowns.forEach((countdown) => { countdown.hidden = true; });

  const duration = config.offerDurationSeconds;
  if (!Number.isSafeInteger(duration) || duration < 0) return;
  // Os dois contadores compartilham o mesmo prazo, criado em cada carregamento.
  // Recalcular pelo relógio mantém o valor correto após uma aba ficar em segundo plano.
  const endsAt = Date.now() + duration * 1000;

  const renderCountdown = () => {
    const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
    const values = {
      hours: Math.floor(remaining / 3600),
      minutes: Math.floor((remaining % 3600) / 60),
      seconds: remaining % 60
    };
    countdowns.forEach((countdown) => {
      for (const [unit, value] of Object.entries(values)) {
        const field = countdown.querySelector(`[data-${unit}]`);
        if (field) field.textContent = String(value).padStart(2, '0');
      }
      countdown.hidden = remaining === 0;
    });
    if (remaining === 0) {
      document.querySelectorAll('[data-offer-time-label]').forEach((label) => {
        label.textContent = 'Consulte a oferta atual';
      });
    }
    return remaining > 0;
  };

  if (renderCountdown()) {
    const timer = window.setInterval(() => {
      if (!renderCountdown()) window.clearInterval(timer);
    }, 1000);
  }
})();
