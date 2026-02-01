
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
  const section = document.querySelector('#built-with');
  const rows = section ? section.querySelectorAll('.built-with__row') : [];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!section || !rows.length) {
    return;
  }

  if (prefersReducedMotion) {
    section.querySelector('.built-with')?.classList.add('is-visible');
    rows.forEach((row) => {
      const track = row.querySelector('.built-with__track');
      if (track) {
        track.style.transform = 'translate3d(0, 0, 0)';
      }
    });
    return;
  }

  const revealTarget = section.querySelector('.built-with');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealTarget?.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(section);

  const state = Array.from(rows).map((row) => ({
    row,
    track: row.querySelector('.built-with__track'),
    direction: Number(row.dataset.direction || 1),
    baseWidth: 0,
    currentOffset: 0,
  }));

  const measure = () => {
    state.forEach((item) => {
      if (!item.track) {
        item.baseWidth = 0;
        return;
      }
      item.baseWidth = item.track.scrollWidth / 2;
    });
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const lerp = (start, end, factor) => start + (end - start) * factor;

  let latestScrollY = window.scrollY;

  const onScroll = () => {
    latestScrollY = window.scrollY;
  };

  const onResize = () => {
    measure();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  measure();

  const animate = () => {
    const rect = section.getBoundingClientRect();
    const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
    const amplitude = clamp(window.innerWidth * 0.18, 80, 220);
    const targetOffset = (progress + latestScrollY * 0.00015) * amplitude;

    state.forEach((item) => {
      if (!item.track || !item.baseWidth) {
        return;
      }
      const desired = targetOffset * item.direction;
      item.currentOffset = lerp(item.currentOffset, desired, 0.08);
      const wrapped = ((item.currentOffset % item.baseWidth) + item.baseWidth) % item.baseWidth;
      const translateX = item.direction < 0 ? -wrapped : wrapped;
      item.track.style.transform = `translate3d(${translateX}px, 0, 0)`;
    });

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
});
