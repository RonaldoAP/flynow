import { PERFIS } from './pontuacao.js';

/** Aceita só os 4 slugs conhecidos — o ?p= vem da URL e é entrada não confiável. */
export function resolverPerfil(daQuery, doGuardado) {
  if (PERFIS.includes(daQuery)) return daQuery;
  if (PERFIS.includes(doGuardado)) return doGuardado;
  return null;
}
