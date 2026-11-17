/* Link de saida do quiz: pagina de vendas de calvicie (/calvicie-m) + parametros de entrada.
   Sem src na URL, marca src=quiz-m para separar as vendas que vieram do quiz. */
(() => {
  'use strict';
  const OFFER = window.location.origin + '/calvicie-m';
  if (document.getElementById('dv-offer')) return;
  const destination = new URL(OFFER);
  const incoming = new URLSearchParams(window.location.search);
  for (const key of new Set(incoming.keys())) {
    // A integracao oficial determina esses valores. Copiar os da entrada os duplicaria.
    if (key === 'clickid' || key === 'rtkck' || destination.searchParams.has(key)) continue;
    for (const value of incoming.getAll(key)) destination.searchParams.append(key, value);
  }
  if (!destination.searchParams.has('src')) destination.searchParams.set('src', 'quiz-m');
  const link = document.createElement('a');
  link.id = 'dv-offer';
  link.href = destination.href;
  link.hidden = true;
  link.setAttribute('aria-hidden', 'true');
  link.tabIndex = -1;
  document.body.appendChild(link);
})();
