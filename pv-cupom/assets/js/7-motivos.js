(function () {
  "use strict";

  var reducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Entrada suave dos blocos editoriais. */
  var reveals = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (element) {
      element.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    reveals.forEach(function (element) {
      observer.observe(element);
    });
  }

  /* Countdown persistente: 30 minutos a partir da primeira visita. */
  var hoursNode = document.querySelector("[data-hours]");
  var minutesNode = document.querySelector("[data-minutes]");
  var secondsNode = document.querySelector("[data-seconds]");
  var countdownDuration = 30 * 60 * 1000;
  var countdownStorageKey = "divessence-7-motivos-deadline-v2";

  if (hoursNode && minutesNode && secondsNode) {
    var now = Date.now();
    var deadline = 0;

    try {
      deadline = Number(window.localStorage.getItem(countdownStorageKey)) || 0;
    } catch (error) {
      deadline = 0;
    }

    if (!deadline) {
      deadline = now + countdownDuration;
      try {
        window.localStorage.setItem(countdownStorageKey, String(deadline));
      } catch (error) {
        /* O timer continua na sessao quando o storage estiver indisponivel. */
      }
    }

    function pad(value) {
      return String(value).padStart(2, "0");
    }

    function renderCountdown() {
      var remaining = Math.max(0, deadline - Date.now());
      var totalSeconds = Math.ceil(remaining / 1000);
      var hours = Math.floor(totalSeconds / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      var seconds = totalSeconds % 60;

      hoursNode.textContent = pad(hours);
      minutesNode.textContent = pad(minutes);
      secondsNode.textContent = pad(seconds);

      return remaining;
    }

    renderCountdown();
    var countdownInterval = window.setInterval(function () {
      if (renderCountdown() > 0) return;
      window.clearInterval(countdownInterval);
    }, 1000);
  }

  /* Mantem os parametros de campanha ao sair para o checkout. */
  var currentParams = new URLSearchParams(window.location.search);
  if (currentParams.size) {
    document.querySelectorAll('a[href^="https://divessencebeauty.com.br/pv-checkout"]').forEach(
      function (link) {
        try {
          var checkoutUrl = new URL(link.href);
          currentParams.forEach(function (value, key) {
            if (!checkoutUrl.searchParams.has(key)) {
              checkoutUrl.searchParams.set(key, value);
            }
          });
          link.href = checkoutUrl.toString();
        } catch (error) {
          /* Mantem o link original se o navegador nao aceitar URL. */
        }
      },
    );
  }

  /* CTA compacto depois que o visitante avanca pelos primeiros motivos. */
  var stickyBuy = document.querySelector("[data-sticky-buy]");
  var offer = document.getElementById("comprar");

  function updateStickyBuy() {
    if (!stickyBuy || !offer) return;
    var offerTop = offer.getBoundingClientRect().top;
    var shouldShow = window.scrollY > 900 && offerTop > window.innerHeight * 0.45;
    stickyBuy.classList.toggle("is-visible", shouldShow);
  }

  window.addEventListener("scroll", updateStickyBuy, { passive: true });
  window.addEventListener("resize", updateStickyBuy);
  updateStickyBuy();
})();
