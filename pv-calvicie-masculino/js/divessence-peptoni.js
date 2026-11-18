const thumbnails = Array.from(document.querySelectorAll('.thumb-row button'));
const heroImage = document.querySelector('.main-image img');
const counter = document.querySelector('.gallery-counter');
let current = 0;

function showImage(index) {
  current = (index + thumbnails.length) % thumbnails.length;
  const selected = thumbnails[current];
  thumbnails.forEach((button, position) => {
    button.classList.toggle('active', position === current);
    button.setAttribute('aria-pressed', String(position === current));
  });
  heroImage.src = selected.querySelector('img').getAttribute('src');
  heroImage.alt = selected.dataset.alt;
  counter.textContent = (current + 1) + ' / ' + thumbnails.length;
  heroImage.parentElement.setAttribute('aria-label', 'Imagem ' + counter.textContent + ' da galeria do produto');
}

thumbnails.forEach((button, index) => button.addEventListener('click', () => showImage(index)));
document.querySelector('.gallery-arrow-left').addEventListener('click', () => showImage(current - 1));
document.querySelector('.gallery-arrow-right').addEventListener('click', () => showImage(current + 1));
heroImage.parentElement.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  showImage(current + (event.key === 'ArrowLeft' ? -1 : 1));
});
showImage(0);

const cards = Array.from(document.querySelectorAll('.bundle-card'));
const terms = document.querySelector('#kit-condicao');
const checkout = document.querySelector('a[data-checkout]');
function selectKit(selected) {
  cards.forEach((card) => {
    card.classList.toggle('selected', card === selected);
    card.setAttribute('aria-pressed', String(card === selected));
  });
  terms.textContent = selected.dataset.terms;
  checkout.href = window.CheckoutParams.buildCheckoutUrl(selected.dataset.link, null, selected.dataset.kit);
  checkout.setAttribute('aria-label', 'Comprar ' + selected.getAttribute('aria-label'));
}
cards.forEach((card) => card.addEventListener('click', () => selectKit(card)));
selectKit(document.querySelector('.bundle-card.selected'));

if (/^https?:$/.test(location.protocol) && /^(www\.)?divessencebeauty\.com\.br$/.test(location.hostname)) {
  const redtrack = document.createElement('script');
  redtrack.src = 'https://red.track.divessencebeauty.com.br/unilpclick.js?attribution=lastpaid&cookiedomain=&cookieduration=90&defaultcampaignid=6a5908f939d1b65f467961dd&regviewonce=false';
  document.head.append(redtrack);
}
