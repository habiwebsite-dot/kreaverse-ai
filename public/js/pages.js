// Provider & Model Data
const PROVIDER_DATA = {
  'kie-ai': { name: 'Kie AI', models: ['seedream', 'flux', 'kling'], types: { seedream: 'image', flux: 'image', kling: 'video' }, description: 'Image & Video generation terbaik' },
  'api-box': { name: 'API Box', models: ['default'], types: { default: 'image' }, description: 'API Box generasi gambar' },
  'apiframe': { name: 'Apiframe.ai', models: ['default'], types: { default: 'image' }, description: 'Apiframe image AI' },
  'crun': { name: 'Crun.ai', models: ['default'], types: { default: 'image' }, description: 'Crun AI generation' },
  'sunoapi': { name: 'SunoAPI', models: ['music'], types: { music: 'audio' }, description: 'AI Music generation' },
  'evolink': { name: 'Evolink.ai', models: ['default'], types: { default: 'video' }, description: 'Evolink video AI' },
  'aimastering': { name: 'AI Mastering', models: ['mastering'], types: { mastering: 'audio' }, description: 'Professional audio mastering' },
  'deepseek': { name: 'DeepSeek', models: ['chat'], types: { chat: 'chat' }, description: 'DeepSeek chat AI' },
  'leonardo': { name: 'Leonardo.ai', models: ['image'], types: { image: 'image' }, description: 'Leonardo image generation' },
  'gemini': { name: 'Gemini AI', models: ['chat'], types: { chat: 'chat' }, description: 'Google Gemini chat' },
  'grok': { name: 'Grok AI', models: ['chat'], types: { chat: 'chat' }, description: 'xAI Grok chat' }
};

function renderHome(container) {
  container.innerHTML = `
    <section class="hero">
      <h1 style="background: linear-gradient(135deg, #3182CE, #D53F8C); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${t('heroTitle')}</h1>
      <p>${t('heroSub')}</p>
      <div style="margin-top:2rem;">
        <a href="#/playground" class="btn btn-primary">🚀 ${t('tryNow')}</a>
        <a href="#/layanan" class="btn btn-outline" style="margin-left:1rem;">📋 ${t('viewServices')}</a>
      </div>
    </section>
    <div class="container grid grid-4 mt-3">
      <a href="#/playground?provider=kie-ai" class="card text-center" style="text-decoration:none; color:inherit;">
        <div style="font-size:2.5rem;">🖼️</div><h3>${t('categoryImage')}</h3><p>Seedream, Flux, Leonardo</p>
      </a>
      <a href="#/playground?provider=evolink" class="card text-center" style="text-decoration:none; color:inherit;">
        <div style="font-size:2.5rem;">🎥</div><h3>${t('categoryVideo')}</h3><p>Kling, Evolink</p>
      </a>
      <a href="#/playground?provider=sunoapi" class="card text-center" style="text-decoration:none; color:inherit;">
        <div style="font-size:2.5rem;">🎵</div><h3>${t('categoryAudio')}</h3><p>SunoAPI, AI Mastering</p>
      </a>
      <a href="#/playground?provider=deepseek" class="card text-center" style="text-decoration:none; color:inherit;">
        <div style="font-size:2.5rem;">💬</div><h3>${t('categoryChat')}</h3><p>DeepSeek, Gemini, Grok</p>
      </a>
    </div>
    <a href="#/playground?provider=sunoapi" style="text-decoration:none;">
      <div class="container" style="background:var(--gradient); padding:2rem; text-align:center; margin:2rem auto; border-radius:1rem; color:#fff; font-size:1.2rem; font-weight:600;">${t('audioBanner')}</div>
    </a>
    <div class="container grid grid-2">
      <div class="card text-center"><h3>💎 Langganan Premium</h3><p style="font-size:1.5rem; font-weight:700;">Rp 700.000</p><p>3 bulan unlimited tanpa batas</p><a href="#/pembayaran" class="btn btn-primary mt-2">Langganan Sekarang</a></div>
      <div class="card text-center"><h3>🔑 API Key Pribadi</h3><p>Gunakan API key sendiri, multi-key support</p><a href="#/dashboard" class="btn btn-outline mt-2">Kelola API Key</a></div>
    </div>
  `;
}

// Semua fungsi lain tetap sama seperti yang sebelumnya Anda miliki
// ...
