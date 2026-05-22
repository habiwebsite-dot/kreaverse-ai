// Global state
let currentUser = null;

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
