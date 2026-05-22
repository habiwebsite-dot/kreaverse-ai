function showWatermarkOncePerDay() {
  const lastShown = localStorage.getItem('watermarkDate');
  const today = new Date().toDateString();
  const watermark = document.getElementById('watermark');
  if (!watermark) return;
  if (lastShown !== today) {
    watermark.style.display = 'flex';
    localStorage.setItem('watermarkDate', today);
    setTimeout(() => { watermark.style.display = 'none'; }, 5000);
  } else { watermark.style.display = 'none'; }
}
function updateAuthUI() {
  const authArea = document.getElementById('authArea');
  if (!authArea) return;
  if (isLoggedIn()) {
    authArea.innerHTML = `<a href="#/dashboard">${t('dashboard')}</a><a href="#/chat">${t('chat')}</a><a href="#" onclick="logout()">${t('logout')}</a>`;
  } else {
    authArea.innerHTML = `<a href="#/login">${t('login')}</a>`;
  }
}
function loadPromoBanner() {
  fetch('/api/v1/admin/settings').then(r => r.json()).then(d => {
    if (d.data?.promo_banner?.active) {
      const banner = document.getElementById('promoBanner');
      if (banner) {
        banner.innerHTML = d.data.promo_banner.link ? `<a href="${d.data.promo_banner.link}" style="color:#fff;">${d.data.promo_banner.text}</a>` : d.data.promo_banner.text;
        banner.style.display = 'block';
      }
    }
  });
}
window.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
  const langToggle = document.getElementById('langToggle');
  if (langToggle) langToggle.addEventListener('click', () => { const langs = ['id','en']; const idx = langs.indexOf(currentLang); setLang(langs[(idx+1)%langs.length]); });
  showWatermarkOncePerDay();
  updateAuthUI();
  loadPromoBanner();
  renderPage();
});
window.addEventListener('hashchange', renderPage);