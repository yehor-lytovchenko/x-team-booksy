const scrollBtn = document.querySelector('.scroll-up');

window.addEventListener('scroll', () => {
  if (window.scrollY > 800) {
    scrollBtn.classList.add('visible');
  } else {
    scrollBtn.classList.remove('visible');
  }
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
