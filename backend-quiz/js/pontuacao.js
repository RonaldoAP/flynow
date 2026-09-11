export const PERFIS = ['tom', 'olhar', 'firmeza', 'barreira'];

export const LETRA_PARA_PERFIL = {
  A: 'tom',
  B: 'olhar',
  C: 'firmeza',
  D: 'barreira',
};

/**
 * P1 é a âncora e decide o perfil, sempre.
 *
 * Por quê: com apenas P1 e P2 pontuando 1 ponto cada, só existem dois casos.
 * Se concordam, o perfil tem 2 pontos e vence. Se discordam, é empate 1x1 e
 * o desempate é a favor da P1. Nos dois casos vence a P1 — logo a pontuação
 * por soma seria código morto, e escrevê-la daria a falsa impressão de que
 * a P2 roteia.
 *
 * A P2 continua valendo, mas por outro motivo: ela faz a pessoa reconhecer
 * o próprio padrão antes de ler o resultado, o que faz o resultado parecer
 * merecido em vez de sorteado. É UX, não roteamento.
 *
 * Se um dia a P2 precisar roteirizar de fato, o caminho é uma terceira
 * pergunta que pontue — aí maiorias 2x1 passam a existir.
 */
export function calcularPerfil(respostas = {}) {
  return LETRA_PARA_PERFIL[respostas.p1] || null;
}
