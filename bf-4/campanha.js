// Applied before the official kit selector initializes.
(() => {
  const config = window.DIVESSENCE_CONFIG;
  const deadline = Date.parse("2026-12-01T00:00:00-03:00");
  const start = Date.parse("2026-11-08T00:00:00-03:00");
  config.campaignEndsAt = null;
  config.dailyCampaign.enabled = false;

  document.querySelectorAll("[data-bonus]").forEach(el => el.textContent = "COMPRE 1, LEVE 2   ✦   ");
  const titles = ["Compre 1, leve 2","Compre 2, leve 3","Compre 4, leve 6"];
  ["one","three","six"].forEach((key,index) => {
    const offer = config.offers[key];
    offer.title = titles[index];
    if (key === "one") {
      offer.quantity = 2;
      offer.unitPrice = offer.price / 2;
    }
    document.querySelectorAll('input[value="'+key+'"]').forEach(input => {
      const row = input.closest(".kit-option");
      const portrait = row.querySelector(".kit-portrait");
      portrait.innerHTML = '<i></i>'.repeat(offer.quantity);
      row.querySelector(".kit-copy strong").textContent = offer.title;
      row.querySelector(".kit-copy small").textContent = offer.unitPrice.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})+" por frasco · frete grátis";
    });
  });

  const section = document.querySelector(".bf-deadline");
  document.querySelector("[data-deadline-date]").textContent = "Até 30 de novembro · Horário de Brasília";
  document.querySelector("[data-phase-start]").textContent = "08/11";
  document.querySelector("[data-phase-end]").textContent = "30/11";
  document.querySelector("[data-deadline-explanation]").textContent = "Escolha seu kit nas condições da Black Friday.";
  const progress = document.querySelector("[data-phase-progress]");
  let timer;

  function updateDeadline() {
    const now = Date.now();
    const seconds = Math.max(0, Math.ceil((deadline - now) / 1000));
    if (seconds === 0) {
      section.style.display = "none";
      clearInterval(timer);
      return;
    }

    const values = {
      days: Math.floor(seconds / 86400),
      hours: Math.floor(seconds / 3600) % 24,
      minutes: Math.floor(seconds / 60) % 60,
      seconds: seconds % 60
    };
    Object.entries(values).forEach(([key, value]) => {
      document.querySelector('[data-remaining="' + key + '"]').textContent = String(value).padStart(2, "0");
    });
    progress.style.transform = "scaleX(" + Math.max(0, (now - start) / (deadline - start)) + ")";
  }

  timer = setInterval(updateDeadline, 1000);
  updateDeadline();
})();
