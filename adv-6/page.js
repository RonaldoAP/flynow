(() => {
  'use strict';
  const track = document.querySelector('.carousel__track');
  const dots = [...document.querySelectorAll('[data-slide]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  function show(index) {
    current = Math.max(0, Math.min(dots.length - 1, index));
    track.scrollTo({left: track.clientWidth * current, behavior: reduced.matches ? 'instant' : 'smooth'});
  }
  dots.forEach((dot, index) => dot.addEventListener('click', () => show(index)));
  document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => show(current + Number(button.dataset.step))));
  track.addEventListener('scroll', () => {
    current = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((dot, index) => { dot.classList.toggle('carousel__dot--active', index === current); dot.setAttribute('aria-current', String(index === current)); });
  }, {passive:true});
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  window.addEventListener('resize', () => show(current));
})();
