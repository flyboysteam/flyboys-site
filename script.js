const carousel = document.querySelector('#carousel');
const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.dot')];
const privacyLink = document.querySelector('.legal a');
const privacyModal = document.querySelector('#privacy-modal');
const closePrivacyModal = privacyModal.querySelector('.modal-close');
let activeIndex = 0;

function setPrivacyModal(isOpen) {
  privacyModal.classList.toggle('is-open', isOpen);
  privacyModal.setAttribute('aria-hidden', String(!isOpen));
  if (isOpen) closePrivacyModal.focus();
}

privacyLink.addEventListener('click', (event) => {
  event.preventDefault();
  setPrivacyModal(true);
});
closePrivacyModal.addEventListener('click', () => setPrivacyModal(false));
privacyModal.addEventListener('click', (event) => {
  if (event.target === privacyModal) setPrivacyModal(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setPrivacyModal(false);
});

function moveTo(index) {
  if (window.matchMedia('(max-width: 700px)').matches) return;
  activeIndex = (index + slides.length) % slides.length;
  const slide = slides[activeIndex];
  carousel.scrollTo({
    left: slide.offsetLeft - (carousel.clientWidth - slide.offsetWidth) / 2,
    behavior: 'smooth',
  });
  dots.forEach((dot, i) => dot.classList.toggle('is-active', i === activeIndex));
}

document.querySelectorAll('.arrow').forEach((button) => {
  button.addEventListener('click', () => moveTo(activeIndex + (button.dataset.direction === 'next' ? 1 : -1)));
});
dots.forEach((dot, index) => dot.addEventListener('click', () => moveTo(index)));

carousel.addEventListener('scrollend', () => {
  if (window.matchMedia('(max-width: 700px)').matches) return;
  activeIndex = slides.reduce((closest, slide, index) => {
    const distance = Math.abs(slide.getBoundingClientRect().left + slide.offsetWidth / 2 - (window.innerWidth / 2));
    return distance < closest.distance ? { index, distance } : closest;
  }, { index: 0, distance: Infinity }).index;
  dots.forEach((dot, index) => dot.classList.toggle('is-active', index === activeIndex));
});

window.addEventListener('resize', () => moveTo(activeIndex));
moveTo(0);
