function showWatermarkOncePerDay() {
  const lastShown = localStorage.getItem('watermarkDate');
  const today = new Date().toDateString();
  const watermark = document.getElementById('watermark');
  if (!watermark) return;
  if (lastShown !== today) {
    watermark.style.display = 'flex';
    localStorage.setItem('watermarkDate', today);
    setTimeout(() => { watermark.style.display = 'none'; }, 5000);
  } else {
    watermark.style.display = 'none';
  }
}

function updateAuthUI() {
  const authArea = document.getElementById('authArea');
  if (!authArea) return;
  if (isLoggedIn()) {
    authArea.innerHTML = `
      <a href="#/dashboard">${t('dashboard')}</a>
      <a href="#/chat">${t('chat')}</a>
      <a href="#" onclick="logout()">${t('logout')}</a>
    `;
  } else {
    authArea.innerHTML = `<a href="#/login">${t('login')}</a>`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const langs = ['id','en','jw','md'];
      const idx = langs.indexOf(currentLang);
      const next = langs[(idx+1) % langs.length];
      setLang(next);
    });
  }
  showWatermarkOncePerDay();
  updateAuthUI();
  renderPage();
});

window.addEventListener('hashchange', renderPage);
