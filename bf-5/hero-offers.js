(function () {
  "use strict";

  const carousel = document.querySelector(".bonus-carousel");
  if (!carousel) return;
  const track = carousel.querySelector(".bonus-slides");
  const slides = Array.from(track.children);
  const dots = Array.from(carousel.querySelectorAll("[data-bonus-slide]"));
  const toggle = carousel.querySelector(".bonus-toggle");
  let active = 0;
  let paused = false;
  let visible = true;
  let timer;
  let pointerStart;

  function schedule() {
    window.clearTimeout(timer);
    const focusedOffer = carousel.querySelector(".bonus-slide :focus-visible");
    if (paused || !visible || pointerStart || document.hidden || focusedOffer) return;
    timer = window.setTimeout(() => show(active + 1), 1500);
  }

  function show(index) {
    active = (index + slides.length) % slides.length;
    track.style.transform = "translateX(-" + active * 100 + "%)";
    slides.forEach((slide, position) => {
      slide.inert = position !== active;
      slide.setAttribute("aria-hidden", String(position !== active));
    });
    dots.forEach((dot, position) => dot.setAttribute("aria-pressed", String(position === active)));
    schedule();
  }

  function updateToggle() {
    toggle.textContent = paused ? "▶" : "Ⅱ";
    toggle.setAttribute("aria-label", paused ? "Iniciar troca automática" : "Pausar troca automática");
  }

  carousel.querySelector(".bonus-prev").addEventListener("click", () => show(active - 1));
  carousel.querySelector(".bonus-next").addEventListener("click", () => show(active + 1));
  dots.forEach((dot, index) => dot.addEventListener("click", () => show(index)));
  toggle.addEventListener("click", () => {
    paused = !paused;
    updateToggle();
    schedule();
  });
  carousel.addEventListener("keydown", event => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      show(active + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  track.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse") return;
    pointerStart = {x:event.clientX, y:event.clientY};
    window.clearTimeout(timer);
  });
  track.addEventListener("pointerup", event => {
    if (!pointerStart) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = undefined;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      show(active + (dx < 0 ? 1 : -1));
    } else {
      schedule();
    }
  });
  track.addEventListener("pointercancel", () => {
    pointerStart = undefined;
    schedule();
  });
  carousel.addEventListener("focusin", schedule);
  carousel.addEventListener("focusout", () => window.setTimeout(schedule, 0));
  document.addEventListener("visibilitychange", schedule);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    schedule();
  }, {threshold:0.15}).observe(carousel);
  updateToggle();
  show(0);
})();
