function showWatermarkOncePerDay() {
  const lastShown = localStorage.getItem('watermarkDate');
  const today = new Date().toDateString();
  if (lastShown !== today) {
    const watermark = document.getElementById('watermark');
    if (watermark) {
      watermark.style.display = 'flex';
      localStorage.setItem('watermarkDate', today);
      setTimeout(() => { watermark.style.display = 'none'; }, 5000);
    }
  } else {
    const watermark = document.getElementById('watermark');
    if (watermark) watermark.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  document.getElementById('langToggle')?.addEventListener('click', () => {
    const langs = ['id','en','jw','md'];
    const idx = langs.indexOf(currentLang);
    const next = langs[(idx+1) % langs.length];
    setLang(next);
  });
  showWatermarkOncePerDay();
  updateAuthUI();
  renderPage();
});

window.addEventListener('hashchange', renderPage);