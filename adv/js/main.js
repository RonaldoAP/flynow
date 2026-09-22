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

  const offer = safeUrl(config.offerUrl);
  if (offer) {
    const incoming = new URLSearchParams(location.search);
    document.querySelectorAll('[data-offer-link]').forEach((link) => {
      const destination = new URL(offer.href);
      const current = safeUrl(link.href);
      // O pretrack pode concluir antes deste script; mantém a atribuição que ele gerou.
      if (current && current.origin === offer.origin && current.pathname === offer.pathname) {
        for (const key of new Set(current.searchParams.keys())) {
          if (!destination.searchParams.has(key)) {
            for (const value of current.searchParams.getAll(key)) destination.searchParams.append(key, value);
          }
        }
      }
      for (const key of new Set(incoming.keys())) {
        // O pretrack define clickid/rtkck a partir de rtkcid ou de uma nova visita.
        // Copiá-los da entrada faria o script oficial acrescentar chaves duplicadas.
        if (key === 'clickid' || key === 'rtkck' || destination.searchParams.has(key)) continue;
        for (const value of incoming.getAll(key)) destination.searchParams.append(key, value);
      }
      link.href = destination.href;
      link.removeAttribute('aria-disabled');
    });
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

  const dialog = document.querySelector('.image-dialog');
  const enlarged = dialog.querySelector('.dialog-image');
  const scroller = dialog.querySelector('.dialog-image-scroll');
  let trigger;

  document.querySelectorAll('[data-expand-image]').forEach((button) => {
    button.addEventListener('click', () => {
      const image = button.querySelector('img');
      trigger = button;
      enlarged.src = image.currentSrc || image.src;
      enlarged.alt = image.alt;
      enlarged.width = image.naturalWidth || image.width;
      enlarged.height = image.naturalHeight || image.height;
      dialog.showModal();
      scroller.scrollTop = 0;
      scroller.scrollLeft = 0;
    });
  });

  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => trigger?.focus({ preventScroll: true }));
})();
