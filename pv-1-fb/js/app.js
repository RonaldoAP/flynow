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
var REDTRACK = "https://red.track.divessencebeauty.com.br";

// PENDÊNCIA: informe a URL da página de back redirect. 
var BACK_REDIRECT_URL = "https://protocolorevive.com/pv-back/";

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

/* ---------- 3. AO REVELAR A OFERTA ---------- */

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

/* ---------- 4. DELAY DA VSL (script oficial VTurb) ---------- */

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
  iniciarDelay();
  iniciarBackRedirect();
});
