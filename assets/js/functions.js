
window.addEventListener('scroll', () => {
  const intro = document.querySelector('.intro');
  const scrollY = window.scrollY;
  const fadeStart = 0;
  const fadeEnd = window.innerHeight * 0.1; // Adjust how soon it fades

  if (scrollY <= fadeEnd) {
    const opacity = 1 - scrollY / fadeEnd;
    const scale = 1 - (scrollY / fadeEnd) * 0.05;
    intro.style.opacity = opacity;
    intro.style.transform = `scale(${scale})`;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const tiles = document.querySelectorAll('.built-with__tile');
  const stack = document.querySelector('.built-with__stack');

  if (!tiles.length || !stack) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    tiles.forEach((tile) => {
      tile.classList.add('is-visible');
      tile.style.transitionDelay = '0ms';
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tiles.forEach((tile, index) => {
            tile.style.transitionDelay = `${index * 100}ms`;
            tile.classList.add('is-visible');
          });
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(stack);
});
