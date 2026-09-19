const header = document.getElementById('header');
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('primary-nav');

/* Solid header after scrolling */
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* Mobile nav */
function setNav(open) {
  nav.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('nav-open', open);
}
toggle.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));
window.matchMedia('(min-width: 900px)').addEventListener('change', e => { if (e.matches) setNav(false); });

/* Stat counters */
const counters = document.querySelectorAll('[data-count]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCount(el) {
  const target = +el.dataset.count;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  if (reduceMotion) { el.textContent = prefix + target + suffix; return; }

  const duration = 1600;
  const start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { animateCount(entry.target); obs.unobserve(entry.target); }
  });
}, { threshold: 0.4 });
counters.forEach(c => io.observe(c));