/* Saída do quiz capilar para a página correspondente da Divessence. */
(() => {
  'use strict';
  if (document.getElementById('dv-offer')) return;
  const destination = new URL('/pv-calvicie-masculino', window.location.origin);
  const params = new URLSearchParams(window.location.search);
  if (!params.get('src')) params.set('src', 'quiz');
  if (!params.get('clickid') && params.get('rtkcid')) params.set('clickid', params.get('rtkcid'));
  destination.search = params.toString();

  const link = document.createElement('a');
  link.id = 'dv-offer';
  link.href = destination.href;
  link.hidden = true;
  link.setAttribute('aria-hidden', 'true');
  link.tabIndex = -1;
  document.body.appendChild(link);
})();
