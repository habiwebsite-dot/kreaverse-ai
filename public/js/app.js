// Global state
let currentUser = null;

window.addEventListener('hashchange', renderPage);
window.addEventListener('DOMContentLoaded', () => {
  showWatermarkOncePerDay();
  updateAuthUI();
  renderPage();
  document.getElementById('langToggle')?.addEventListener('click', () => {
    const langs = ['id','en','jw','md'];
    const idx = langs.indexOf(currentLang);
    const next = langs[(idx+1) % langs.length];
    setLang(next);
  });
});

function renderPage() {
  const hash = window.location.hash || '#/';
  const main = document.getElementById('mainContent');
  updateAuthUI();
  if (!main) return;
  switch (hash) {
    case '#/': renderHome(main); break;
    case '#/tools': renderTools(main); break;
    case '#/playground': renderPlayground(main); break;
    case '#/chat': renderChat(main); break;
    case '#/music-cover': renderMusicCover(main); break;
    case '#/dashboard': renderDashboard(main); break;
    case '#/tentang': renderAbout(main); break;
    case '#/layanan': renderLayanan(main); break;
    case '#/login': renderLogin(main); break;
    case '#/register': renderRegister(main); break;
    case '#/pembayaran': renderPembayaran(main); break;
    case '#/dokumentasi': renderDokumentasi(main); break;
    case '#/referral': renderReferral(main); break;
    case '#/enter-referral': renderEnterReferral(main); break;
    default: renderHome(main);
  }
}

function updateAuthUI() {
  const authArea = document.getElementById('authArea');
  if (!authArea) return;
  const token = localStorage.getItem('token');
  if (token) {
    authArea.innerHTML = `
      <a href="#/dashboard">${t('dashboard')}</a>
      <a href="#/chat">${t('chat')}</a>
      <a href="#" onclick="logout()">${t('logout')}</a>
    `;
  } else {
    authArea.innerHTML = `<a href="#/login">${t('login')}</a>`;
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.hash = '#/';
  location.reload();
}

function isLoggedIn() {
  return !!localStorage.getItem('token');
}