
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

