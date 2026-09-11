// js/resultado.js
import { RESULTADOS, PROMESSA_COMUM } from './resultados.js';
import { resolverPerfil } from './resolver-perfil.js';
import { enviar } from './mautic.js';

let guardado = null;
try {
  guardado = JSON.parse(localStorage.getItem('quizDivessence') || 'null');
} catch (e) { /* navegação privada */ }

const perfil = resolverPerfil(
  new URLSearchParams(location.search).get('p'),
  guardado && guardado.perfil
);

const alvo = document.getElementById('conteudo');

if (!perfil) {
  alvo.insertAdjacentHTML('beforeend', `
    <h1 class="h1">Não encontrei o seu resultado</h1>
    <p class="nota">O link pode ter sido cortado pelo aplicativo de e-mail.
       Refazer o quiz leva menos de dois minutos.</p>
    <a class="btn" style="text-align:center;text-decoration:none" href="index.html">Refazer o quiz</a>
  `);
} else {
  const r = RESULTADOS[perfil];
  // Escapa nó de texto (& e < bastam nesse contexto); não serve para valor de atributo.
  const texto = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  alvo.insertAdjacentHTML('beforeend', `
    <p class="eyebrow">O seu resultado</p>
    <h1 class="h1">${texto(r.nome)}</h1>
    <p>${texto(r.oQueQuerDizer)}</p>

    <div class="bloco claro">
      <p class="eyebrow" style="margin-bottom:14px">3 sinais que confirmam</p>
      <ul class="sinais">${r.sinais.map(s => `<li>${texto(s)}</li>`).join('')}</ul>
    </div>

    <div class="bloco">
      <p class="eyebrow" style="margin-bottom:14px">O que isso não é</p>
      <p>${texto(r.oQueNaoE)}</p>
    </div>

    <div class="bloco">
      <p class="nota">Guarda isso — não porque seja um diagnóstico, não é.
         É uma leitura do que você mesma respondeu, organizada.
         Serve para você saber o que procurar.</p>
      <p style="margin-top:24px"><strong>${texto(r.ponte)}</strong></p>
      <p class="nota" style="margin-top:18px">${texto(PROMESSA_COMUM)}</p>
    </div>

    <form class="bloco" id="captura">
      <p class="eyebrow" style="margin-bottom:14px">Quer receber o resto?</p>
      <p class="nota" style="margin-bottom:20px">Escrevo nos próximos dias explicando
         o que está por baixo do seu resultado. Sem desconto, sem pressa.</p>
      <input class="campo" type="text" name="nome" placeholder="Seu primeiro nome" aria-label="Seu primeiro nome" autocomplete="given-name" required>
      <input class="campo" type="email" name="email" placeholder="Seu melhor e-mail" aria-label="Seu melhor e-mail" autocomplete="email" required>
      <button class="btn" type="submit">Quero receber</button>
      <p class="nota" style="margin-top:14px">Você pode sair quando quiser, em um clique.</p>
    </form>

    <p class="rodape">
      Camila Reis · Atendimento Divessence<br><br>
      Este quiz é uma ferramenta educacional. Não é diagnóstico dermatológico
      nem substitui avaliação profissional. Se você tem uma queixa de pele
      persistente, procure um dermatologista.
    </p>
  `);
}

const form = document.getElementById('captura');
if (form) {
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!form.nome.value.trim()) return;
    const botao = form.querySelector('button');
    botao.disabled = true;
    botao.textContent = 'Enviando…';

    try {
      await enviar({
        nome: form.nome.value.trim(),
        email: form.email.value.trim(),
        perfil_pele: perfil,
        faixa_etaria: guardado && guardado.faixa_etaria,
        estagio_rotina: guardado && guardado.estagio_rotina,
      });
    } catch (e) {
      // rede caiu; segue para a confirmação assim mesmo — o resultado dela
      // já está na tela e insistir aqui só gera atrito
    }

    form.replaceChildren();
    form.setAttribute('role', 'status');
    form.insertAdjacentHTML('beforeend', `
      <p class="eyebrow" style="margin-bottom:14px">Pronto</p>
      <p>O primeiro e-mail chega em alguns minutos. Se não aparecer,
         dá uma olhada na aba de promoções.</p>
    `);
  });
}
