// js/mautic.js
const HOST = 'https://mautic.automacaoflynow.site';
export const FORM_ID = 1;
const ALIAS = 'divessence';

const CAMPOS = ['nome', 'email', 'perfil_pele', 'faixa_etaria', 'estagio_rotina'];

export function montarPayload(dados) {
  const p = new URLSearchParams();
  for (const c of CAMPOS) {
    const v = dados[c] ?? '';
    if (v !== '' || c === 'nome' || c === 'email') p.set(`mauticform[${c}]`, v);
  }
  p.set('mauticform[formId]', String(FORM_ID));
  p.set('mauticform[formName]', ALIAS);
  p.set('mauticform[return]', '');
  return p;
}

/**
 * A resposta é opaca por CORS, então não dá para confirmar o sucesso pelo
 * status. Isso é aceitável: o resultado dela já está na tela, e um POST que
 * falhe não pode travar a página.
 */
export async function enviar(dados) {
  await fetch(`${HOST}/form/submit?formId=${FORM_ID}`, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: montarPayload(dados).toString(),
    signal: AbortSignal.timeout(8000),
  });
}
