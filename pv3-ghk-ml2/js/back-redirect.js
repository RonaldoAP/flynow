/* Back redirect independente do player e do rastreamento. */
(function () {
  "use strict";
  var destination = new URL("https://protocolorevive.com/pv-back/");
  new URLSearchParams(window.location.search).forEach(function (value, key) {
    if (key !== "preview" && !destination.searchParams.has(key)) {
      destination.searchParams.append(key, value);
    }
  });

  var marker = "__reviveBackV2";
  var redirecting = false;

  function arm(event) {
    if (event && !event.isTrusted) return;
    if (history.state && history.state[marker] === "guard") return;
    var base = Object.assign({}, history.state);
    base[marker] = "base";
    var guard = Object.assign({}, base);
    guard[marker] = "guard";
    try {
      history.replaceState(base, "", window.location.href);
      history.pushState(guard, "", window.location.href);
    } catch (error) {
      console.warn("Não foi possível ativar o back redirect.", error);
    }
  }

  window.addEventListener("popstate", function (event) {
    if (redirecting || !event.state || event.state[marker] !== "base") return;
    redirecting = true;
    window.location.replace(destination.toString());
  });

  // Cria a entrada após interação real, respeitando as regras do navegador.
  ["click", "touchend", "keydown"].forEach(function (name) {
    window.addEventListener(name, arm, { capture: true, passive: true });
  });
  window.addEventListener("pageshow", function () {
    redirecting = false;
    if (navigator.userActivation && navigator.userActivation.hasBeenActive) arm();
  });
  if (navigator.userActivation && navigator.userActivation.hasBeenActive) arm();
})();
