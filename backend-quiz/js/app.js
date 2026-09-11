// js/app.js
import { PERGUNTAS } from './quiz-data.js';
import { calcularPerfil } from './pontuacao.js';

const el = {
  progresso: document.getElementById('progresso'),
  passo: document.getElementById('passo'),
  pergunta: document.getElementById('pergunta'),
  ajuda: document.getElementById('ajuda'),
  opcoes: document.getElementById('opcoes'),
  avancar: document.getElementById('avancar'),
  semjs: document.getElementById('semjs'),
};

// Se a execucao chegou aqui, o modulo carregou: troca o aviso pelo quiz.
el.semjs.hidden = true;
el.passo.hidden = false;
el.avancar.hidden = false;

let indice = 0;
let selecionada = null;
const respostas = {};

function render() {
  const q = PERGUNTAS[indice];
  selecionada = null;
  el.avancar.disabled = true;
  el.progresso.style.width = `${(indice / PERGUNTAS.length) * 100}%`;
  el.passo.textContent = `Pergunta ${indice + 1} de ${PERGUNTAS.length}`;
  el.pergunta.textContent = q.pergunta;
  el.ajuda.textContent = q.ajuda || '';
  el.ajuda.hidden = !q.ajuda;

  el.opcoes.replaceChildren(...q.opcoes.map(o => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'opcao';
    b.textContent = o.label;
    b.addEventListener('click', () => {
      selecionada = o;
      el.opcoes.querySelectorAll('.opcao').forEach(x => {
        x.classList.remove('sel');
        x.setAttribute('aria-pressed', 'false');
      });
      b.classList.add('sel');
      b.setAttribute('aria-pressed', 'true');
      el.avancar.disabled = false;
    });
    return b;
  }));
  window.scrollTo(0, 0);
  el.pergunta.focus();
}

el.avancar.addEventListener('click', () => {
  if (!selecionada || indice >= PERGUNTAS.length) return;
  const q = PERGUNTAS[indice];
  respostas[q.id] = selecionada.letra;
  if (q.campo) respostas[q.campo] = selecionada.valor;

  indice += 1;
  if (indice < PERGUNTAS.length) return render();

  const perfil = calcularPerfil(respostas);
  // calcularPerfil só devolve null se a P1 não foi respondida, o que o fluxo
  // impede — mas se acontecer, é melhor voltar do que mostrar resultado errado.
  if (!perfil) { indice = 0; return render(); }

  try {
    localStorage.setItem('quizDivessence', JSON.stringify({
      perfil,
      faixa_etaria: respostas.faixa_etaria,
      estagio_rotina: respostas.estagio_rotina,
    }));
  } catch (e) {
    // navegação privada bloqueia localStorage; o ?p= abaixo carrega o resultado
  }
  location.href = `resultado.html?p=${perfil}`;
});

window.addEventListener('pageshow', (ev) => {
  if (ev.persisted && indice >= PERGUNTAS.length) {
    indice = 0;
    for (const k of Object.keys(respostas)) delete respostas[k];
    render();
  }
});

render();
