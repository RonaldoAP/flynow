// Applied before the official kit selector initializes.
const calendar = new Intl.DateTimeFormat("sv-SE", {timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"});
const today = () => calendar.format(new Date());
const phase = day => day < "2026-11-01" || day > "2026-11-11" ? 0 : day < "2026-11-08" ? 1 : 2;
const current = phase(today());
if (!current) {
  location.replace("/bf-4/campanha-encerrada.html" + location.search);
} else {
  const config = window.DIVESSENCE_CONFIG;
  config.campaignEndsAt = current === 1 ? "2026-11-08T00:00:00-03:00" : "2026-11-12T00:00:00-03:00";
  config.dailyCampaign.labelOffer = "Esta fase da Black Friday encerra em";
  if (current === 2) document.querySelectorAll("[data-bonus]").forEach(el => el.textContent = "COMPRE 1, LEVE 2   ✦   ");
  const titles = current === 1 ? ["1 frasco","3 frascos","6 frascos"] : ["Compre 1, leve 2","Compre 2, leve 3","Compre 4, leve 6"];
  ["one","three","six"].forEach((key,index) => {
    const offer = config.offers[key];
    offer.title = titles[index];
    if (current === 2 && key === "one") {
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
  const checkPhase = () => { if (phase(today()) !== current) location.reload(); };
  setInterval(checkPhase,30000);
  document.addEventListener("visibilitychange",checkPhase);
}

if (current) {
  const deadline = Date.parse(window.DIVESSENCE_CONFIG.campaignEndsAt);
  const start = Date.parse(current === 1 ? "2026-11-01T00:00:00-03:00" : "2026-11-08T00:00:00-03:00");
  document.querySelector("[data-deadline-date]").textContent = current === 1 ? "Até 7 de novembro · Horário de Brasília" : "Até 11 de novembro · Horário de Brasília";
  document.querySelector("[data-phase-start]").textContent = current === 1 ? "01/11" : "08/11";
  document.querySelector("[data-phase-end]").textContent = current === 1 ? "07/11" : "11/11";
  document.querySelector("[data-deadline-explanation]").textContent = current === 1
    ? "Escolha seu kit nesta fase. À meia-noite de 8 de novembro, começa a próxima etapa da Black Friday."
    : "Aproveite os kits desta fase. A campanha termina à meia-noite de 12 de novembro.";
  function updateDeadline() {
    const now = Date.now();
    const seconds = Math.max(0, Math.ceil((deadline - now) / 1000));
    const values = {
      days: Math.floor(seconds / 86400),
      hours: Math.floor(seconds / 3600) % 24,
      minutes: Math.floor(seconds / 60) % 60,
      seconds: seconds % 60
    };
    Object.entries(values).forEach(([key,value]) => {
      document.querySelectorAll('[data-remaining="'+key+'"]').forEach(el => el.textContent = String(value).padStart(2,"0"));
    });
    document.querySelector("[data-phase-progress]").style.transform = "scaleX("+Math.max(0,Math.min(1,(now-start)/(deadline-start)))+")";
    if (phase(today()) !== current) location.reload();
  }
  updateDeadline();
  setInterval(updateDeadline,1000);
}
