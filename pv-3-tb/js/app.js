/* =========================================================
   Divessence · VSL
   Somente o necessário: delay da VSL, RedTrack e back redirect.
   ========================================================= */

/* ---------- CONFIGURAÇÃO ---------- */

// Tempo do pitch na VSL (minutos * 60 + segundos). 36:17 = 2177
var DELAY_SECONDS = 36 * 60 + 17;

// Duração do cronômetro da oferta
var TIMER_MINUTES = 20;

// Domínio de tracking do RedTrack
var REDTRACK = "https://red.track.protocolorejuve.com";

// Links de clique do RedTrack
var CHECKOUT = {
  six: REDTRACK + "/click/3", // 6 frascos
  three: REDTRACK + "/click/2", // 3 frascos
  one: REDTRACK + "/click/1", // 1 frasco
};

// PENDÊNCIA: informe a URL da página de back redirect. Vazio = desligado.
var BACK_REDIRECT_URL = "";

/* ---------- UTILITÁRIOS ---------- */

// Preserva UTMs, rtkcid, src e demais parâmetros da URL atual
function comParametros(url) {
  try {
    var destino = new URL(url, window.location.href);
    new URLSearchParams(window.location.search).forEach(function (valor, chave) {
      if (chave === "preview") return;
      if (!destino.searchParams.has(chave)) {
        destino.searchParams.append(chave, valor);
      }
    });
    return destino.toString();
  } catch (e) {
    return url;
  }
}

/* ---------- 1. LINKS DE CHECKOUT ---------- */

function iniciarCheckout() {
  document.querySelectorAll("[data-checkout]").forEach(function (link) {
    var url = CHECKOUT[link.dataset.checkout];
    if (!url) {
      link.classList.add("is-disabled");
      link.setAttribute("aria-disabled", "true");
      return;
    }
    link.href = comParametros(url);
  });
}

/* ---------- 2. POSTBACK InitiateCheckout (RedTrack) ---------- */

function iniciarPostback() {
  var clickid = new URLSearchParams(window.location.search).get("rtkcid");

  if (!clickid) {
    console.warn(
      "ClickID (rtkcid) não encontrado na URL da página. Conversão não será disparada.",
    );
    return;
  }

  // Delegação: qualquer clique em um elemento .smartplayer-click-event dispara
  // o postback InitiateCheckout e só então redireciona para o link do RedTrack.
  document.addEventListener("click", function (event) {
    var element = event.target.closest(".smartplayer-click-event");
    if (!element) return;

    event.preventDefault();

    var postbackURL =
      REDTRACK + "/postback?clickid=" + clickid + "&type=InitiateCheckout";
    console.log("Disparando InitiateCheckout para ClickID: " + clickid);

    var targetUrl = element.href || element.getAttribute("data-checkout-url");

    fetch(postbackURL, { method: "GET" })
      .then(function (response) {
        console.log(
          "Conversão InitiateCheckout disparada com sucesso para ClickID: " +
            clickid,
          response,
        );
        if (targetUrl) window.location.href = targetUrl;
      })
      .catch(function (error) {
        console.error("Erro ao disparar conversão InitiateCheckout:", error);
        if (targetUrl) window.location.href = targetUrl;
      });
  });

  console.log("RedTrack rastreamento ativado para ClickID: " + clickid);
}

/* ---------- 3. COMENTÁRIOS DO EPISÓDIO ---------- */

function atualizarContadorComentario(formulario) {
  var campo = formulario.querySelector("textarea");
  var contador = formulario.querySelector("[data-character-count]");
  if (campo && contador) contador.textContent = campo.value.length + "/280";
}

function fecharFormularioComentario(formulario, limpar) {
  if (!formulario) return;
  formulario.hidden = true;
  if (limpar) formulario.reset();
  atualizarContadorComentario(formulario);

  document
    .querySelectorAll('[data-comment-reply="' + formulario.id + '"]')
    .forEach(function (botao) {
      botao.setAttribute("aria-expanded", "false");
    });
}

function iniciarComentarios() {
  var secao = document.querySelector("#viewer-comments");
  if (!secao) return;

  secao.addEventListener("click", function (event) {
    var curtir = event.target.closest("[data-comment-like]");
    if (curtir) {
      var ativo = curtir.getAttribute("aria-pressed") !== "true";
      var rotulo = curtir.querySelector("[data-like-label]");
      var reacao = curtir.parentElement.querySelector("[data-reaction-count]");
      curtir.setAttribute("aria-pressed", String(ativo));
      if (rotulo) rotulo.textContent = ativo ? "Curtido" : "Curtir";
      if (reacao) {
        reacao.hidden = !ativo;
        reacao.textContent = ativo ? "1" : "";
      }
      return;
    }

    var responder = event.target.closest("[data-comment-reply]");
    if (responder) {
      var formulario = document.getElementById(responder.dataset.commentReply);
      if (!formulario) return;
      var abrir = formulario.hidden;

      document.querySelectorAll("[data-comment-reply-form]").forEach(function (outro) {
        if (outro !== formulario) fecharFormularioComentario(outro, false);
      });

      formulario.hidden = !abrir;
      document
        .querySelectorAll('[data-comment-reply="' + formulario.id + '"]')
        .forEach(function (botao) {
          botao.setAttribute("aria-expanded", String(abrir));
        });

      if (abrir) {
        var campo = formulario.querySelector("textarea");
        var autor = responder.dataset.replyAuthor;
        if (campo && autor && !campo.value) campo.value = "@" + autor + " ";
        atualizarContadorComentario(formulario);
        if (campo) campo.focus();
      }
      return;
    }

    var cancelar = event.target.closest("[data-comment-cancel]");
    if (cancelar) {
      fecharFormularioComentario(
        cancelar.closest("[data-comment-reply-form]"),
        true,
      );
    }
  });

  secao.addEventListener("input", function (event) {
    var formulario = event.target.closest("[data-comment-reply-form]");
    if (formulario) atualizarContadorComentario(formulario);
  });

  secao.addEventListener("submit", function (event) {
    var formulario = event.target;
    if (!formulario.matches("[data-comment-reply-form]")) return;
    event.preventDefault();

    var campo = formulario.querySelector("textarea");
    var texto = campo ? campo.value.trim() : "";
    var respostas = formulario.nextElementSibling;
    if (!texto || !respostas || !respostas.matches("[data-comment-replies]")) return;

    var artigo = document.createElement("article");
    artigo.className = "viewer-comment viewer-comment--reply viewer-comment--user";
    artigo.setAttribute("data-comment", "");

    var avatar = document.createElement("span");
    avatar.className = "viewer-comment__avatar viewer-comment__avatar--you";
    avatar.setAttribute("aria-hidden", "true");

    var conteudo = document.createElement("div");
    conteudo.className = "viewer-comment__content";
    var bolha = document.createElement("div");
    bolha.className = "viewer-comment__bubble";
    var nome = document.createElement("strong");
    nome.textContent = "Você";
    var paragrafo = document.createElement("p");
    paragrafo.textContent = texto;
    bolha.append(nome, paragrafo);

    var acoes = document.createElement("div");
    acoes.className = "viewer-comment__actions";
    acoes.setAttribute("aria-label", "Ações da sua resposta");
    var tempo = document.createElement("time");
    tempo.textContent = "agora";
    acoes.appendChild(tempo);
    conteudo.append(bolha, acoes);
    artigo.append(avatar, conteudo);
    respostas.appendChild(artigo);

    fecharFormularioComentario(formulario, true);
    var status = document.querySelector("#comments-status");
    if (status) status.textContent = "Sua resposta foi publicada nesta página.";
  });
}

function iniciarGaleriaVideos() {
  var secao = document.querySelector(".social-videos");
  if (!secao) return;

  var trilha = secao.querySelector("[data-social-video-track]");
  var anterior = secao.querySelector("[data-social-video-prev]");
  var proximo = secao.querySelector("[data-social-video-next]");
  var containerPontos = secao.querySelector("[data-social-video-dots]");
  var status = secao.querySelector("[data-social-video-status]");

  if (!trilha || !anterior || !proximo || !containerPontos) {
    return;
  }

  Array.from(trilha.querySelectorAll("[data-social-video-clone]")).forEach(
    function (clone) {
      clone.remove();
    },
  );

  var cards = Array.from(trilha.querySelectorAll("[data-social-video-card]"));
  var total = cards.length;
  var indiceAtual = 0;
  var indiceFisicoAtual = total;
  var reposicionando = false;
  var pontos = [];

  if (!total) return;

  function criarClone(card, indice) {
    var clone = card.cloneNode(true);
    clone.removeAttribute("data-social-video-card");
    clone.setAttribute("data-social-video-clone", "");
    clone.setAttribute("data-social-video-index", String(indice));
    clone.setAttribute("aria-hidden", "true");
    clone.removeAttribute("role");
    clone.removeAttribute("aria-roledescription");
    clone.removeAttribute("aria-label");
    clone.removeAttribute("id");
    clone.querySelectorAll("[id]").forEach(function (elemento) {
      elemento.removeAttribute("id");
    });
    clone
      .querySelectorAll("video, a, button, input, select, textarea, [tabindex]")
      .forEach(function (elemento) {
        elemento.setAttribute("tabindex", "-1");
      });
    return clone;
  }

  var clonesAntes = document.createDocumentFragment();
  var clonesDepois = document.createDocumentFragment();

  cards.forEach(function (card, indice) {
    card.setAttribute("data-social-video-index", String(indice));
    card.setAttribute("aria-posinset", String(indice + 1));
    card.setAttribute("aria-setsize", String(total));
    clonesAntes.appendChild(criarClone(card, indice));
    clonesDepois.appendChild(criarClone(card, indice));
  });

  trilha.insertBefore(clonesAntes, trilha.firstChild);
  trilha.appendChild(clonesDepois);

  var itens = Array.from(trilha.querySelectorAll(".social-video-card"));
  var videos = Array.from(trilha.querySelectorAll(".social-video-card video"));

  function indiceLogicoDo(item) {
    return Number(item.getAttribute("data-social-video-index")) || 0;
  }

  function esquerdaDoItem(indiceFisico) {
    return itens[indiceFisico].offsetLeft - itens[0].offsetLeft;
  }

  function atualizarControles() {
    anterior.disabled = total < 2;
    proximo.disabled = total < 2;
    itens.forEach(function (item, indice) {
      item.classList.toggle("is-active", indice === indiceFisicoAtual);
      item.classList.toggle(
        "is-neighbor",
        Math.abs(indice - indiceFisicoAtual) === 1,
      );
      var video = item.querySelector("video");
      if (video) {
        var podeReceberFoco =
          indice === indiceFisicoAtual &&
          !item.hasAttribute("data-social-video-clone");
        video.setAttribute("tabindex", podeReceberFoco ? "0" : "-1");
      }
    });
    pontos.forEach(function (ponto, indice) {
      ponto.setAttribute("aria-current", String(indice === indiceAtual));
    });
    if (status) {
      status.textContent =
        "Vídeo " + (indiceAtual + 1) + " de " + total + " selecionado.";
    }
  }

  function pausarForaDo(itemAtivo) {
    videos.forEach(function (video) {
      if (!itemAtivo || !itemAtivo.contains(video)) {
        if (!video.paused) video.pause();
      }
    });
  }

  function saltarSemAnimacao(indiceFisico) {
    var scrollBehaviorAnterior = trilha.style.scrollBehavior;
    var scrollSnapAnterior = trilha.style.scrollSnapType;
    reposicionando = true;
    indiceFisicoAtual = indiceFisico;
    indiceAtual = indiceLogicoDo(itens[indiceFisicoAtual]);

    trilha.style.scrollBehavior = "auto";
    trilha.style.scrollSnapType = "none";
    trilha.scrollLeft = esquerdaDoItem(indiceFisicoAtual);

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        trilha.style.scrollBehavior = scrollBehaviorAnterior;
        trilha.style.scrollSnapType = scrollSnapAnterior;
        reposicionando = false;
      });
    });
  }

  function irParaPosicao(indiceFisico, animar) {
    indiceFisicoAtual = Math.max(
      0,
      Math.min(indiceFisico, itens.length - 1),
    );
    var itemAtivo = itens[indiceFisicoAtual];
    indiceAtual = indiceLogicoDo(itemAtivo);
    var reduzirMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    trilha.scrollTo({
      left: esquerdaDoItem(indiceFisicoAtual),
      behavior: animar === false || reduzirMovimento ? "auto" : "smooth",
    });
    pausarForaDo(itemAtivo);
    atualizarControles();
  }

  function irParaVideo(indice, animar) {
    var indiceNormalizado = ((indice % total) + total) % total;
    var candidatos = [
      indiceNormalizado,
      total + indiceNormalizado,
      total * 2 + indiceNormalizado,
    ];
    var indiceMaisProximo = candidatos.reduce(function (melhor, candidato) {
      return Math.abs(candidato - indiceFisicoAtual) <
        Math.abs(melhor - indiceFisicoAtual)
        ? candidato
        : melhor;
    }, candidatos[0]);
    irParaPosicao(indiceMaisProximo, animar);
  }

  cards.forEach(function (_, indice) {
    var ponto = document.createElement("button");
    ponto.type = "button";
    ponto.setAttribute("aria-label", "Mostrar vídeo " + (indice + 1));
    ponto.addEventListener("click", function () {
      irParaVideo(indice);
    });
    containerPontos.appendChild(ponto);
    pontos.push(ponto);
  });

  anterior.addEventListener("click", function () {
    irParaPosicao(indiceFisicoAtual - 1);
  });

  proximo.addEventListener("click", function () {
    irParaPosicao(indiceFisicoAtual + 1);
  });

  trilha.addEventListener("keydown", function (event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    irParaPosicao(
      indiceFisicoAtual + (event.key === "ArrowRight" ? 1 : -1),
    );
  });

  var atualizarAoRolar;
  trilha.addEventListener("scroll", function () {
    if (reposicionando) return;
    window.clearTimeout(atualizarAoRolar);
    atualizarAoRolar = window.setTimeout(function () {
      var alvo = trilha.scrollLeft;
      var indiceMaisProximo = 0;
      var menorDistancia = Infinity;
      itens.forEach(function (_, indice) {
        var distancia = Math.abs(esquerdaDoItem(indice) - alvo);
        if (distancia < menorDistancia) {
          menorDistancia = distancia;
          indiceMaisProximo = indice;
        }
      });

      indiceFisicoAtual = indiceMaisProximo;
      indiceAtual = indiceLogicoDo(itens[indiceFisicoAtual]);

      var indiceCentral = indiceFisicoAtual;
      if (indiceFisicoAtual < total) indiceCentral += total;
      if (indiceFisicoAtual >= total * 2) indiceCentral -= total;

      if (indiceCentral !== indiceFisicoAtual) {
        saltarSemAnimacao(indiceCentral);
      }

      pausarForaDo(itens[indiceFisicoAtual]);
      atualizarControles();
    }, 120);
  }, { passive: true });

  videos.forEach(function (videoAtual) {
    videoAtual.addEventListener("play", function () {
      var cardAtual = videoAtual.closest(".social-video-card");
      var indiceDoCard = itens.indexOf(cardAtual);
      if (indiceDoCard >= 0) {
        indiceFisicoAtual = indiceDoCard;
        indiceAtual = indiceLogicoDo(cardAtual);
        atualizarControles();
      }
      videos.forEach(function (outroVideo) {
        if (outroVideo !== videoAtual && !outroVideo.paused) outroVideo.pause();
      });
    });
  });

  itens.forEach(function (item, indice) {
    item.addEventListener("click", function (event) {
      if (indice === indiceFisicoAtual) return;
      event.preventDefault();
      irParaPosicao(indice);
    });
  });

  if ("ResizeObserver" in window) {
    new ResizeObserver(function () {
      if (!trilha.clientWidth) return;
      window.requestAnimationFrame(function () {
        saltarSemAnimacao(total + indiceAtual);
        atualizarControles();
      });
    }).observe(trilha);
  }

  window.requestAnimationFrame(function () {
    if (trilha.clientWidth) saltarSemAnimacao(total);
    atualizarControles();
  });
}

/* ---------- 4. AO REVELAR A OFERTA ---------- */

var carregadoEm = Date.now();
var ofertaRevelada = false;

// Reserva: se o player não informar o tempo, uma revelação que acontece
// muito cedo é a restauração do persist (não rola).
var JANELA_PERSIST_MS = 20000;

// A oferta está realmente visível? (independe de COMO a VTurb revelou —
// removendo a classe .esconder OU aplicando display inline)
function ofertaEstaVisivel() {
  var oferta = document.querySelector("#oferta");
  if (!oferta) return false;
  // offsetParent é null quando display:none em qualquer ancestral.
  return oferta.offsetParent !== null || oferta.getClientRects().length > 0;
}

// Tempo atual de reprodução da VSL, quando o player expõe (API oficial VTurb).
function tempoDoVideo() {
  var sp = window.smartplayer;
  var inst = sp && Array.isArray(sp.instances) ? sp.instances[0] : null;
  return inst && inst.video ? inst.video.currentTime || 0 : null;
}

// Decide se deve rolar. Regra à prova de falhas:
//  - se o player informa o tempo e ele chegou perto do pitch  -> pitch REAL, rola
//  - restauração do persist acontece com o vídeo no começo     -> não rola
//  - sem tempo do player, usa o relógio como reserva
function devePitchRolar() {
  var t = tempoDoVideo();
  if (t !== null) return t >= DELAY_SECONDS - 5;
  return Date.now() - carregadoEm > JANELA_PERSIST_MS;
}

// Rola até o início da oferta, deixando a barra "Sessão exclusiva ·
// Tempo restante" no topo da tela e os kits logo abaixo.
function rolarAteAOferta() {
  var alvo = document.querySelector("#oferta");
  if (!alvo) return;

  var semAnimacao = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var posicaoIdeal = 0;

  function posicionar(comAnimacao) {
    // getBoundingClientRect força o cálculo do layout, então a medida é
    // confiável mesmo logo após a oferta deixar de ficar oculta.
    var destino = alvo.getBoundingClientRect().top + window.scrollY - posicaoIdeal;
    window.scrollTo({
      top: Math.max(0, destino),
      behavior: comAnimacao ? "smooth" : "auto",
    });
  }

  posicionar(!semAnimacao);

  // Correção única: se alguma imagem da oferta terminar de carregar durante a
  // rolagem e deslocar o card, reposiciona sem animação.
  window.setTimeout(function () {
    var desvio = Math.abs(alvo.getBoundingClientRect().top - posicaoIdeal);
    if (desvio > 40) posicionar(false);
  }, 900);
}

function aoRevelarOferta() {
  if (ofertaRevelada) return;
  ofertaRevelada = true;

  var comentarios = document.querySelector("#viewer-comments");
  if (comentarios) comentarios.hidden = true;

  iniciarCronometro();

  // Só rola no pitch real; na restauração do persist a página fica parada.
  if (devePitchRolar()) rolarAteAOferta();
}

/* ---------- CRONÔMETRO ---------- */

var cronometroAtivo = false;

function iniciarCronometro() {
  if (cronometroAtivo) return;
  cronometroAtivo = true;

  var minutos = document.querySelector("[data-minutes]");
  var segundos = document.querySelector("[data-seconds]");
  var titulo = document.querySelector("[data-timer-heading]");
  var barra = document.querySelector("#cronometro");
  if (!minutos || !segundos) return;

  var fim = Date.now() + TIMER_MINUTES * 60 * 1000;

  var tick = function () {
    var restante = Math.max(0, Math.ceil((fim - Date.now()) / 1000));
    var m = Math.floor(restante / 60);
    var s = restante % 60;

    minutos.textContent = String(m).padStart(2, "0");
    segundos.textContent = String(s).padStart(2, "0");

    if (restante === 0) {
      clearInterval(intervalo);
      if (titulo) titulo.textContent = "Sessão encerrada";
      if (barra) barra.classList.add("is-expired");
    }
  };

  tick();
  var intervalo = setInterval(tick, 1000);
}

/* ---------- 5. DELAY DA VSL (script oficial VTurb) ---------- */

function iniciarDelay() {
  var oferta = document.querySelector("#oferta");
  if (!oferta) return;

  // Dispara os efeitos assim que a oferta fica de fato visível — não importa
  // se a VTurb removeu a classe .esconder ou aplicou display inline.
  // Observa class E style; confirma pela visibilidade real.
  var observer = new MutationObserver(function () {
    if (ofertaEstaVisivel()) {
      aoRevelarOferta();
      observer.disconnect();
    }
  });
  observer.observe(oferta, {
    attributes: true,
    attributeFilter: ["class", "style"],
  });

  // Modo de teste:
  //   ?preview        -> libera e ROLA (mesma experiência do pitch)
  //   ?preview=still   -> libera sem rolar
  var params = new URLSearchParams(window.location.search);
  if (params.has("preview")) {
    var semRolar = params.get("preview") === "still";
    oferta.classList.remove("esconder");
    ofertaRevelada = true;
    var comentarios = document.querySelector("#viewer-comments");
    if (comentarios) comentarios.hidden = true;
    iniciarCronometro();
    if (!semRolar) rolarAteAOferta();
    return;
  }

  // Script oficial de delay da VTurb.
  var player = document.querySelector("vturb-smartplayer");
  if (player) {
    player.addEventListener("player:ready", function () {
      player.displayHiddenElements(DELAY_SECONDS, [".esconder"], {
        persist: true,
      });
    });
  }

  // Reserva: se por qualquer motivo a VTurb não revelar a oferta, o próprio
  // site libera no tempo do pitch (só quando o vídeo passou desse ponto).
  var checagem = window.setInterval(function () {
    if (ofertaRevelada) {
      window.clearInterval(checagem);
      return;
    }
    var t = tempoDoVideo();
    if (t !== null && t >= DELAY_SECONDS) {
      oferta.classList.remove("esconder");
      // o observer acima detecta e dispara aoRevelarOferta()
    }
  }, 1000);
}

/* ---------- 6. BACK REDIRECT ---------- */

function iniciarBackRedirect() {
  if (!BACK_REDIRECT_URL) return;

  var destino = comParametros(BACK_REDIRECT_URL);

  history.pushState({}, "", location.href);
  history.pushState({}, "", location.href);

  window.addEventListener("popstate", function () {
    location.href = destino;
  });
}

/* ---------- INÍCIO ---------- */

document.addEventListener("DOMContentLoaded", function () {
  iniciarCheckout();
  iniciarPostback();
  iniciarComentarios();
  iniciarGaleriaVideos();
  iniciarDelay();
  iniciarBackRedirect();
});
