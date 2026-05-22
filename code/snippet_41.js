// Kreaverse AI - Page Renderers

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
async function renderHomePage(main) {
  main.innerHTML = `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-bg-animation"></div>
      <div class="hero-content">
        <div class="hero-badge">🚀 Platform AI Terlengkap di Indonesia</div>
        <h1 class="hero-title" data-i18n="hero_title">Kreaverse AI</h1>
        <p class="hero-subtitle" data-i18n="hero_subtitle">Platform AI Terlengkap – 11 Provider, Satu Tempat</p>
        <div class="hero-stats">
          <div class="stat-item"><span class="stat-num">11</span><span class="stat-label">Provider AI</span></div>
          <div class="stat-item"><span class="stat-num">50+</span><span class="stat-label">Model AI</span></div>
          <div class="stat-item"><span class="stat-num">4</span><span class="stat-label">Kategori</span></div>
        </div>
        <div class="hero-btns">
          <button class="btn btn-primary btn-lg" onclick="Auth.requireAuth(()=>navigate('/playground'))">
            <span>✨</span> <span data-i18n="hero_cta_try">Coba Sekarang</span>
          </button>
          <button class="btn btn-outline btn-lg" data-route="/about">
            <span>📖</span> <span data-i18n="hero_cta_services">Lihat Layanan</span>
          </button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="ai-orb">
          <div class="orb-ring r1"></div>
          <div class="orb-ring r2"></div>
          <div class="orb-ring r3"></div>
          <div class="orb-core">
            <img src="/images/logo.png" alt="Kreaverse AI" class="orb-logo" onerror="this.innerHTML='🤖'">
          </div>
        </div>
      </div>
    </section>

    <!-- Promo Banner -->
    <div id="promo-banner" class="promo-banner" style="display:none"></div>

    <!-- Category Grid -->
    <section class="section categories-section">
      <div class="container">
        <h2 class="section-title">Kategori Unggulan</h2>
        <div class="categories-grid">
          ${['image','video','audio','chat'].map(cat => `
          <div class="category-card cat-${cat}" onclick="Auth.requireAuth(()=>navigate('/playground?cat=${cat}'))">
            <div class="cat-icon">${{image:'🖼️',video:'🎬',audio:'🎵',chat:'💬'}[cat]}</div>
            <h3 data-i18n="cat_${cat}">AI ${cat.charAt(0).toUpperCase()+cat.slice(1)}</h3>
            <p data-i18n="cat_${cat}_desc"></p>
            <div class="cat-arrow">→</div>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- Audio Banner -->
    <section class="audio-promo-banner">
      <div class="audio-wave-bg"></div>
      <div class="container">
        <div class="audio-promo-content">
          <div class="audio-icon-big">🎤</div>
          <div>
            <h2 data-i18n="audio_banner">🎤 Audio AI – Ciptakan Lagu Hanya dengan Prompt!</h2>
            <p data-i18n="audio_banner_sub">Gunakan Suno, Kie AI, SunoAPI, dan lainnya untuk membuat musik impianmu.</p>
          </div>
          <button class="btn btn-primary" onclick="Auth.requireAuth(()=>navigate('/playground?cat=audio'))">
            Coba Sekarang 🎵
          </button>
        </div>
      </div>
    </section>

    <!-- Providers Section -->
    <section class="section providers-section">
      <div class="container">
        <h2 class="section-title">11 Provider AI Terintegrasi</h2>
        <p class="section-sub">Semua provider terbaik dalam satu platform</p>
        <div class="providers-grid" id="providers-grid">
          ${renderProviderCards()}
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="section how-section">
      <div class="container">
        <h2 class="section-title">Cara Penggunaan</h2>
        <div class="steps-grid">
          ${[
            {n:'1',icon:'🔑',title:'Login',desc:'Login dengan akun yang diberikan admin setelah berlangganan.'},
            {n:'2',icon:'🎛️',title:'Pilih Model',desc:'Pilih provider dan model AI sesuai kebutuhan Anda.'},
            {n:'3',icon:'✍️',title:'Masukkan Prompt',desc:'Ketik prompt kreatif Anda dan atur parameter sesuai keinginan.'},
            {n:'4',icon:'⬇️',title:'Download Hasil',desc:'Tunggu proses AI selesai, lalu unduh hasil berkualitas tinggi.'}
          ].map(s=>`
          <div class="step-card">
            <div class="step-num">${s.n}</div>
            <div class="step-icon">${s.icon}</div>
            <h3>${s.title}</h3>
            <p>${s.desc}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="section pricing-section">
      <div class="container">
        <h2 class="section-title">Harga Terjangkau</h2>
        <div class="pricing-card-wrap">
          <div class="pricing-card featured">
            <div class="pricing-badge">⭐ Paling Populer</div>
            <h3 class="pricing-name">Unlimited Plan</h3>
            <div class="pricing-price">
              <span class="currency">Rp</span>
              <span class="amount" id="price-display">700.000</span>
              <span class="period">/ 3 Bulan</span>
            </div>
            <ul class="pricing-features">
              <li>✅ Akses semua 11 Provider AI</li>
              <li>✅ 50+ Model AI tanpa batas</li>
              <li>✅ Gambar, Video, Audio, Chat</li>
              <li>✅ Upload via Cloudinary</li>
              <li>✅ Download HQ tanpa watermark</li>
              <li>✅ Support prioritas WhatsApp</li>
              <li>✅ Update model terbaru gratis</li>
            </ul>
            <button class="btn btn-primary btn-full" data-route="/payment">
              Berlangganan Sekarang 🚀
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Carousel / Gallery -->
    <section class="section gallery-section">
      <div class="container">
        <h2 class="section-title">Hasil Karya AI</h2>
        <div class="gallery-carousel" id="gallery-carousel">
          ${renderGalleryPlaceholders()}
        </div>
      </div>
    </section>
  `;

  // Load pricing from config
  if (publicConfig.subscriptionPrice) {
    const priceEl = document.getElementById('price-display');
    if (priceEl) priceEl.textContent = Number(publicConfig.subscriptionPrice).toLocaleString('id-ID');
  }
}

function renderProviderCards() {
  const providers = [
    {id:'kie-ai',name:'Kie AI',cats:['image','video','audio','chat'],color:'#3182CE'},
    {id:'api-box',name:'API Box',cats:['image','video'],color:'#805AD5'},
    {id:'apiframe',name:'Apiframe.ai',cats:['image'],color:'#D53F8C'},
    {id:'crun',name:'Crun.ai',cats:['image','video','audio'],color:'#DD6B20'},
    {id:'sunoapi',name:'SunoAPI.org',cats:['audio'],color:'#38A169'},
    {id:'evolink',name:'Evolink.ai',cats:['image','video'],color:'#00B5D8'},
    {id:'aimastering',name:'AI Mastering',cats:['audio'],color:'#E53E3E'},
    {id:'deepseek',name:'DeepSeek',cats:['chat'],color:'#3182CE'},
    {id:'leonardo',name:'Leonardo.ai',cats:['image'],color:'#B7791F'},
    {id:'gemini',name:'Gemini AI',cats:['chat','image'],color:'#4299E1'},
    {id:'grok',name:'Grok AI',cats:['chat','image'],color:'#718096'}
  ];

  const catEmoji = {image:'🖼️',video:'🎬',audio:'🎵',chat:'💬'};
  return providers.map(p => `
    <div class="provider-card" onclick="Auth.requireAuth(()=>navigate('/playground?provider=${p.id}'))">
      <div class="provider-logo-wrap">
        <img src="/images/providers/${p.id}.png" alt="${p.name}" 
             onerror="this.parentElement.innerHTML='<div class=\\'provider-letter\\' style=\\'background:${p.color}\\' >${p.name.charAt(0)}</div>'">
      </div>
      <div class="provider-name">${p.name}</div>
      <div class="provider-cats">${p.cats.map(c=>`<span class="cat-tag cat-tag-${c}">${catEmoji[c]}</span>`).join('')}</div>
    </div>
  `).join('');
}

function renderGalleryPlaceholders() {
  const items = [
    {emoji:'🏙️',label:'Cityscape AI',type:'image'},
    {emoji:'🎵',label:'AI Music',type:'audio'},
    {emoji:'🎬',label:'AI Video',type:'video'},
    {emoji:'🌌',label:'Galaxy Art',type:'image'},
    {emoji:'🎸',label:'Rock Song',type:'audio'},
    {emoji:'🌊',label:'Ocean Video',type:'video'}
  ];
  return `<div class="gallery-track">${items.map(i=>`
    <div class="gallery-item gallery-${i.type}">
      <div class="gallery-placeholder">${i.emoji}</div>
      <p>${i.label}</p>
    </div>`).join('')}</div>`;
}

// ─── PLAYGROUND PAGE ─────────────────────────────────────────────────────────
async function renderPlaygroundPage(main) {
  if (!Auth.isLoggedIn()) { showLoginModal(); return; }

  const urlParams = new URLSearchParams(window.location.search);
  const defaultProvider = urlParams.get('provider') || 'kie-ai';
  const defaultCat = urlParams.get('cat') || '';

  showWatermark();

  main.innerHTML = `
    <div class="playground-layout">
      <!-- Left Panel: Form -->
      <div class="playground-form-panel">
        <div class="panel-header">
          <h2>🎛️ <span data-i18n="pg_title">Playground AI</span></h2>
        </div>

        <!-- API Mode Toggle -->
        <div class="api-mode-bar">
          <label class="toggle-wrap">
            <input type="checkbox" id="use-server-api" checked>
            <span class="toggle-slider"></span>
          </label>
          <span id="api-mode-label" data-i18n="api_mode_server">Pakai API Server (Unlimited)</span>
          <button class="btn btn-xs btn-ghost" data-route="/dashboard" title="Kelola API Key">⚙️</button>
        </div>

        <!-- Provider Select -->
        <div class="form-group">
          <label data-i18n="pg_provider">Provider</label>
          <select id="pg-provider" onchange="onProviderChange()" class="form-control">
            ${renderProviderOptions(defaultProvider)}
          </select>
        </div>

        <!-- Model Select -->
        <div class="form-group">
          <label data-i18n="pg_model">Model</label>
          <select id="pg-model" onchange="onModelChange()" class="form-control">
            <option>Memuat model...</option>
          </select>
        </div>

        <!-- Dynamic Form -->
        <div id="pg-dynamic-form"></div>

        <!-- Prompt -->
        <div class="form-group" id="prompt-group">
          <label data-i18n="pg_prompt">Prompt</label>
          <textarea id="pg-prompt" class="form-control form-textarea" rows="4"
            data-i18n-placeholder="pg_prompt_placeholder" 
            placeholder="Masukkan prompt Anda di sini..."></textarea>
          <div class="prompt-actions">
            <button class="btn btn-xs btn-ghost" onclick="copyToClipboard(document.getElementById('pg-prompt').value)">📋 Copy</button>
            <button class="btn btn-xs btn-ghost" onclick="document.getElementById('pg-prompt').value=''">🗑️ Clear</button>
          </div>
        </div>

        <!-- Generate Button -->
        <button class="btn btn-primary btn-full btn-generate" id="generate-btn" onclick="handleGenerate()">
          <span id="generate-btn-text">✨ Generate</span>
        </button>
      </div>

      <!-- Right Panel: Result -->
      <div class="playground-result-panel">
        <div class="panel-header">
          <h2>📊 <span data-i18n="pg_result">Hasil</span></h2>
          <div id="result-actions" style="display:none">
            <button class="btn btn-sm btn-outline" onclick="downloadAllResults()">⬇️ Unduh Semua</button>
          </div>
        </div>
        <div id="result-container" class="result-container">
          <div class="result-placeholder">
            <div class="placeholder-icon">🤖</div>
            <p>Hasil generate akan muncul di sini</p>
            <p class="text-muted">Pilih provider & model, masukkan prompt, lalu klik Generate</p>
          </div>
        </div>
        <div id="task-status" class="task-status" style="display:none">
          <div class="status-bar">
            <div class="status-progress" id="status-progress"></div>
          </div>
          <p id="status-text" class="status-text"></p>
        </div>
      </div>
    </div>
  `;

  await loadModelsForPlayground();
  onProviderChange(defaultProvider, defaultCat);

  // Toggle API mode
  const toggle = document.getElementById('use-server-api');
  const label = document.getElementById('api-mode-label');
  toggle?.addEventListener('change', () => {
    label.setAttribute('data-i18n', toggle.checked ? 'api_mode_server' : 'api_mode_own');
    i18n.applyAll();
  });
}

let playgroundModels = {};
let currentTaskId = null;
let currentResultUrls = [];

async function loadModelsForPlayground() {
  const r = await API.getModels();
  if (r.ok) {
    playgroundModels = r.data.data;
  } else {
    // Fallback static models
    playgroundModels = getStaticModels();
  }
}

function getStaticModels() {
  return {
    'kie-ai': [{provider:'kie-ai',model:'seedream'},{provider:'kie-ai',model:'flux'},{provider:'kie-ai',model:'flux-pro'},{provider:'kie-ai',model:'kolors'},{provider:'kie-ai',model:'ideogram'},{provider:'kie-ai',model:'img2img'},{provider:'kie-ai',model:'wan-t2v'},{provider:'kie-ai',model:'wan-i2v'},{provider:'kie-ai',model:'kling-t2v'},{provider:'kie-ai',model:'kling-i2v'},{provider:'kie-ai',model:'hailuo-t2v'},{provider:'kie-ai',model:'suno-v4'},{provider:'kie-ai',model:'music-cover'},{provider:'kie-ai',model:'chat'}],
    'api-box': [{provider:'api-box',model:'flux-schnell'},{provider:'api-box',model:'flux-dev'},{provider:'api-box',model:'sdxl'},{provider:'api-box',model:'midjourney'},{provider:'api-box',model:'dalle3'},{provider:'api-box',model:'stable-video'}],
    'apiframe': [{provider:'apiframe',model:'midjourney-imagine'},{provider:'apiframe',model:'midjourney-upscale'},{provider:'apiframe',model:'midjourney-variation'},{provider:'apiframe',model:'faceswap'},{provider:'apiframe',model:'flux-pro'},{provider:'apiframe',model:'stable-diffusion'}],
    'crun': [{provider:'crun',model:'text-to-image'},{provider:'crun',model:'image-to-image'},{provider:'crun',model:'text-to-video'},{provider:'crun',model:'image-to-video'},{provider:'crun',model:'text-to-music'}],
    'sunoapi': [{provider:'sunoapi',model:'generate'},{provider:'sunoapi',model:'generate-custom'},{provider:'sunoapi',model:'lyrics'},{provider:'sunoapi',model:'extend'}],
    'evolink': [{provider:'evolink',model:'flux-image'},{provider:'evolink',model:'stable-diffusion'},{provider:'evolink',model:'text-to-video'},{provider:'evolink',model:'image-to-video'}],
    'aimastering': [{provider:'aimastering',model:'master'}],
    'deepseek': [{provider:'deepseek',model:'deepseek-chat'},{provider:'deepseek',model:'deepseek-coder'},{provider:'deepseek',model:'deepseek-reasoner'}],
    'leonardo': [{provider:'leonardo',model:'phoenix'},{provider:'leonardo',model:'flux-dev'},{provider:'leonardo',model:'flux-schnell'},{provider:'leonardo',model:'alchemy'},{provider:'leonardo',model:'img2img'}],
    'gemini': [{provider:'gemini',model:'gemini-2.0-flash'},{provider:'gemini',model:'gemini-1.5-pro'},{provider:'gemini',model:'gemini-1.5-flash'},{provider:'gemini',model:'imagen-3'}],
    'grok': [{provider:'grok',model:'grok-3'},{provider:'grok',model:'grok-3-mini'},{provider:'grok',model:'grok-2-vision'},{provider:'grok',model:'aurora'}]
  };
}

function renderProviderOptions(selected = 'kie-ai') {
  const providers = [
    {id:'kie-ai',name:'Kie AI'},{id:'api-box',name:'API Box'},{id:'apiframe',name:'Apiframe.ai'},
    {id:'crun',name:'Crun.ai'},{id:'sunoapi',name:'SunoAPI.org'},{id:'evolink',name:'Evolink.ai'},
    {id:'aimastering',name:'AI Mastering'},{id:'deepseek',name:'DeepSeek'},
    {id:'leonardo',name:'Leonardo.ai'},{id:'gemini',name:'Gemini AI'},{id:'grok',name:'Grok AI'}
  ];
  return providers.map(p => `<option value="${p.id}" ${p.id===selected?'selected':''}>${p.name}</option>`).join('');
}

function onProviderChange(provider, filterCat) {
  const sel = document.getElementById('pg-provider');
  const prov = provider || sel?.value;
  if (!prov) return;

  const modelSel = document.getElementById('pg-model');
  if (!modelSel) return;

  const models = playgroundModels[prov] || getStaticModels()[prov] || [];
  const filtered = filterCat ? models.filter(m => isModelInCategory(m.model, filterCat)) : models;

  modelSel.innerHTML = filtered.map(m =>
    `<option value="${m.model}">${formatModelName(m.model)}</option>`
  ).join('') || '<option value="">Tidak ada model</option>';

  onModelChange();
}

function isModelInCategory(model, cat) {
  const m = model.toLowerCase();
  if (cat === 'audio') return m.includes('suno') || m.includes('music') || m.includes('audio') || m.includes('master') || m.includes('cover') || m.includes('lyrics') || m.includes('extend');
  if (cat === 'video') return m.includes('video') || m.includes('wan') || m.includes('kling') || m.includes('hailuo') || m.includes('luma');
  if (cat === 'chat') return m.includes('chat') || m.includes('deepseek') || m.includes('gemini') || m.includes('grok') || m.includes('coder') || m.includes('reasoner');
  if (cat === 'image') return !isModelInCategory(m,'audio') && !isModelInCategory(m,'video') && !isModelInCategory(m,'chat');
  return true;
}

function formatModelName(model) {
  return model.split('-').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
}

function onModelChange() {
  const provider = document.getElementById('pg-provider')?.value;
  const model = document.getElementById('pg-model')?.value;
  if (!provider || !model) return;

  const dynForm = document.getElementById('pg-dynamic-form');
  if (!dynForm) return;

  dynForm.innerHTML = getDynamicFormFields(provider, model);
  initSliders();
}

function getDynamicFormFields(provider, model) {
  const m = model.toLowerCase();
  let fields = '';

  // Common image params
  if (!m.includes('chat') && !m.includes('deepseek') && !m.includes('gemini') && !m.includes('grok') && !m.includes('lyrics') && !m.includes('extend')) {
    if (!m.includes('audio') && !m.includes('suno') && !m.includes('music') && !m.includes('master') && !m.includes('cover')) {
      fields += `
      <div class="form-row">
        <div class="form-group">
          <label data-i18n="pg_aspect_ratio">Aspek Rasio</label>
          <select id="pg-aspect-ratio" class="form-control">
            <option value="1:1">1:1 (Square)</option>
            <option value="16:9" selected>16:9 (Landscape)</option>
            <option value="9:16">9:16 (Portrait)</option>
            <option value="4:3">4:3</option>
            <option value="3:4">3:4</option>
          </select>
        </div>
        <div class="form-group">
          <label data-i18n="pg_steps">Steps</label>
          <input type="number" id="pg-steps" class="form-control" value="28" min="1" max="100">
        </div>
      </div>`;

      fields += `
      <div class="form-group">
        <label data-i18n="pg_negative_prompt">Negative Prompt</label>
        <input type="text" id="pg-negative-prompt" class="form-control" placeholder="Hal yang tidak ingin dimunculkan...">
      </div>`;
    }
  }

  // Upload fields
  if (m.includes('img2img') || m.includes('image-to-image') || m.includes('faceswap') || m.includes('i2v') || m.includes('image-to-video') || m.includes('cover') || m.includes('stable-video')) {
    fields += `
    <div class="form-group">
      <label>${m.includes('cover') ? '🎵 Upload Audio Asli' : m.includes('i2v') || m.includes('image-to-video') ? '🖼️ Upload Gambar Referensi' : '🖼️ Upload Gambar'}</label>
      <div class="upload-area" id="upload-area" onclick="document.getElementById('file-input').click()">
        <input type="file" id="file-input" accept="${m.includes('cover') || m.includes('audio') ? 'audio/*' : 'image/*'}" style="display:none" onchange="handleFileUpload(this)">
        <div class="upload-placeholder" id="upload-placeholder">
          <span>📁</span>
          <p>Klik untuk upload atau drag & drop</p>
          <p class="text-muted">Max 50MB</p>
        </div>
        <div id="upload-preview" style="display:none"></div>
      </div>
      <input type="hidden" id="pg-file-url" value="">
    </div>`;
  }

  // Multi image upload for img2img
  if (m.includes('img2img') && provider === 'kie-ai') {
    fields += `
    <div class="form-group">
      <label>📸 Gambar Referensi Tambahan (maks 5)</label>
      <div class="multi-upload-grid" id="multi-upload-grid">
        ${[2,3,4,5].map(n=>`
        <div class="multi-upload-item" onclick="document.getElementById('file-input-${n}').click()">
          <input type="file" id="file-input-${n}" accept="image/*" style="display:none" 
                 onchange="handleMultiUpload(this,${n})">
          <span>+${n}</span>
          <input type="hidden" id="pg-file-url-${n}" value="">
        </div>`).join('')}
      </div>
    </div>`;
  }

  // Video duration
  if (m.includes('video') || m.includes('wan') || m.includes('kling') || m.includes('hailuo')) {
    fields += `
    <div class="form-group">
      <label>⏱️ <span data-i18n="pg_duration">Durasi (detik)</span></label>
      <input type="range" id="pg-duration" class="form-range" min="3" max="30" value="5" 
             oninput="document.getElementById('duration-val').textContent=this.value">
      <span class="range-value"><span id="duration-val">5</span>s</span>
    </div>`;
  }

  // Music Cover specific
  if (m.includes('cover')) {
    fields += `
    <div class="form-group">
      <label data-i18n="mc_song_title">Judul Lagu</label>
      <input type="text" id="pg-title" class="form-control" placeholder="Judul lagu...">
    </div>
    <div class="form-group">
      <label data-i18n="mc_vocal_gender">Jenis Vokal</label>
      <select id="pg-vocal-gender" class="form-control">
        <option value="female">Wanita</option>
        <option value="male">Pria</option>
      </select>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Style Weight <span id="sw-val">1.0</span></label>
        <input type="range" id="pg-style-weight" class="form-range" min="0" max="2" step="0.1" value="1"
               oninput="document.getElementById('sw-val').textContent=parseFloat(this.value).toFixed(1)">
      </div>
      <div class="form-group">
        <label>Audio Weight <span id="aw-val">1.0</span></label>
        <input type="range" id="pg-audio-weight" class="form-range" min="0" max="2" step="0.1" value="1"
               oninput="document.getElementById('aw-val').textContent=parseFloat(this.value).toFixed(1)">
      </div>
    </div>`;
  }

  // AI Mastering specific
  if (m.includes('master')) {
    fields += `
    <div class="mastering-form">
      <div class="form-row">
        <div class="form-group">
          <label>Target Loudness (LUFS)</label>
          <input type="number" id="pg-target-loudness" class="form-control" value="-14" min="-30" max="-6" step="0.5">
        </div>
        <div class="form-group">
          <label>Ceiling (dB)</label>
          <input type="number" id="pg-ceiling" class="form-control" value="-0.3" min="-6" max="0" step="0.1">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Output Format</label>
          <select id="pg-output-format" class="form-control">
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
            <option value="flac">FLAC</option>
          </select>
        </div>
        <div class="form-group">
          <label>Sample Rate</label>
          <select id="pg-sample-rate" class="form-control">
            <option value="44100">44100 Hz</option>
            <option value="48000">48000 Hz</option>
            <option value="96000">96000 Hz</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Low Cut (Hz)</label>
          <input type="number" id="pg-low-cut" class="form-control" value="20" min="10" max="500">
        </div>
        <div class="form-group">
          <label>High Cut (Hz)</label>
          <input type="number" id="pg-high-cut" class="form-control" value="20000" min="5000" max="22000">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Algoritma</label>
          <select id="pg-algorithm" class="form-control">
            <option value="loudness">Loudness</option>
            <option value="reference">Reference</option>
          </select>
        </div>
        <div class="form-group toggle-group">
          <label>Preserve Bass</label>
          <label class="toggle-wrap">
            <input type="checkbox" id="pg-preserve-bass" checked>
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
      <div class="form-group">
        <label>Reference Audio (opsional)</label>
        <div class="upload-area small" onclick="document.getElementById('ref-audio-input').click()">
          <input type="file" id="ref-audio-input" accept="audio/*" style="display:none" 
                 onchange="handleRefAudioUpload(this)">
          <span>🎵 Upload reference audio</span>
          <input type="hidden" id="pg-ref-audio-url" value="">
        </div>
      </div>
    </div>`;
  }

  // Suno / Music generate
  if (m.includes('suno') || m.includes('generate') && provider === 'sunoapi') {
    if (m.includes('custom') || m.includes('generate-custom')) {
      fields += `
      <div class="form-group">
        <label>Lirik / Lyrics</label>
        <textarea id="pg-lyrics" class="form-control form-textarea" rows="5" placeholder="Masukkan lirik lagu..."></textarea>
      </div>`;
    }
    fields += `
    <div class="form-group">
      <label>Style / Tags</label>
      <input type="text" id="pg-style" class="form-control" placeholder="pop, upbeat, electric guitar...">
    </div>
    <div class="form-group">
      <label>Judul Lagu</label>
      <input type="text" id="pg-title" class="form-control" placeholder="Judul lagu (opsional)">
    </div>
    <div class="toggle-group">
      <label class="toggle-wrap">
        <input type="checkbox" id="pg-instrumental">
        <span class="toggle-slider"></span>
      </label>
      <span>Instrumental (tanpa vokal)</span>
    </div>`;
  }

  // Chat models
  if (m.includes('chat') || m.includes('deepseek') || m.includes('gemini') || m.includes('grok') || m.includes('coder') || m.includes('reasoner') || m.includes('flash') || m.includes('pro')) {
    fields += `
    <div class="form-group">
      <label>Temperature <span id="temp-val">0.7</span></label>
      <input type="range" id="pg-temperature" class="form-range" min="0" max="2" step="0.1" value="0.7"
             oninput="document.getElementById('temp-val').textContent=parseFloat(this.value).toFixed(1)">
    </div>
    <div class="form-group">
      <label>Max Tokens</label>
      <input type="number" id="pg-max-tokens" class="form-control" value="2048" min="100" max="32768">
    </div>`;
  }

  // Seed (for image models)
  if (!m.includes('chat') && !m.includes('audio') && !m.includes('suno') && !m.includes('video') && !m.includes('master')) {
    fields += `
    <div class="form-group">
      <label data-i18n="pg_seed">Seed (-1 = acak)</label>
      <input type="number" id="pg-seed" class="form-control" value="-1">
    </div>`;
  }

  return fields;
}

function initSliders() {
  document.querySelectorAll('.form-range').forEach(r => {
    r.style.setProperty('--val', `${(r.value - r.min) / (r.max - r.min) * 100}%`);
    r.addEventListener('input', function() {
      this.style.setProperty('--val', `${(this.value - this.min) / (this.max - this.min) * 100}%`);
    });
  });
}

let uploadedFileUrl = '';
let uploadedFileName = '';

async function handleFileUpload(input) {
  const file = input.files[0];
  if (!file) return;

  const placeholder = document.getElementById('upload-placeholder');
  const preview = document.getElementById('upload-preview');
  if (placeholder) placeholder.innerHTML = `<div class="spinner-sm"></div><p>Uploading...</p>`;

  const r = await API.upload(file);
  if (r.ok) {
    uploadedFileUrl = r.data.data.url;
    uploadedFileName = file.name;
    const hiddenInput = document.getElementById('pg-file-url');
    if (hiddenInput) hiddenInput.value = uploadedFileUrl;

    if (preview) {
      preview.style.display = 'block';
      if (file.type.startsWith('image')) {
        preview.innerHTML = `<img src="${uploadedFileUrl}" alt="preview" class="upload-preview-img">`;
      } else if (file.type.startsWith('audio')) {
        preview.innerHTML = `<audio controls src="${uploadedFileUrl}" class="upload-preview-audio"></audio>`;
      } else {
        preview.innerHTML = `<p>✅ ${file.name}</p>`;
      }
      if (placeholder) placeholder.style.display = 'none';
    }
    showToast('File berhasil diupload!', 'success');
  } else {
    showToast('Upload gagal: ' + (r.data?.message || 'Error'), 'error');
    if (placeholder) placeholder.innerHTML = '<span>📁</span><p>Klik untuk upload</p>';
  }
}

async function handleMultiUpload(input, n) {
  const file = input.files[0];
  if (!file) return;
  const r = await API.upload(file);
  if (r.ok) {
    const hidden = document.getElementById(`pg-file-url-${n}`);
    if (hidden) hidden.value = r.data.data.url;
    const item = input.closest('.multi-upload-item');
    if (item) item.innerHTML = `<img src="${r.data.data.url}" alt="ref${n}"><input type="hidden" id="pg-file-url-${n}" value="${r.data.data.url}">`;
    showToast(`Gambar ${n} diupload!`, 'success');
  }
}

async function handleRefAudioUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const r = await API.upload(file);
  if (r.ok) {
    const hidden = document.getElementById('pg-ref-audio-url');
    if (hidden) hidden.value = r.data.data.url;
    const area = input.closest('.upload-area');
    if (area) area.innerHTML = `<audio controls src="${r.data.data.url}"></audio><input type="hidden" id="pg-ref-audio-url" value="${r.data.data.url}">`;
    showToast('Reference audio diupload!', 'success');
  }
}

async function handleGenerate() {
  if (!Auth.isLoggedIn()) { showLoginModal(); return; }
  if (!Auth.isActive()) {
    showToast(i18n.t('subscription_expired'), 'warning');
    navigate('/payment');
    return;
  }

  const provider = document.getElementById('pg-provider')?.value;
  const model = document.getElementById('pg-model')?.value;
  const prompt = document.getElementById('pg-prompt')?.value || '';
  const useServerApi = document.getElementById('use-server-api')?.checked;

  if (!provider || !model) { showToast('Pilih provider dan model', 'error'); return; }

  const btn = document.getElementById('generate-btn');
  const btnText = document.getElementById('generate-btn-text');
  if (btn) btn.disabled = true;
  if (btnText) btnText.innerHTML = `<div class="spinner-sm"></div> ${i18n.t('pg_generating')}`;

  // Build input
  const input = buildInput(provider, model, prompt);

  // Build FormData
  const fd = new FormData();
  fd.append('data', JSON.stringify({ provider, model, input, useOwnKey: !useServerApi }));

  // Attach files if any
  const fileInput = document.getElementById('file-input');
  if (fileInput?.files[0]) fd.append('file', fileInput.files[0]);
  for (let n = 2; n <= 5; n++) {
    const fi = document.getElementById(`file-input-${n}`);
    if (fi?.files[0]) fd.append('files', fi.files[0]);
  }
  const refInput = document.getElementById('ref-audio-input');
  if (refInput?.files[0]) fd.append('referenceAudio', refInput.files[0]);

  showTaskStatus('Task dikirim ke server...');
  const resultContainer = document.getElementById('result-container');
  if (resultContainer) resultContainer.innerHTML = `<div class="result-processing"><div class="ai-loader"></div><p>${i18n.t('task_processing')}</p></div>`;

  const r = await API.postForm('/api/v1/jobs/createTask', fd);

  if (!r.ok) {
    showToast(r.data?.message || i18n.t('error_occurred'), 'error');
    resetGenerateBtn();
    hideTaskStatus();
    return;
  }

  const taskId = r.data?.data?.taskId;
  if (!taskId) { showToast('Task ID tidak ditemukan', 'error'); resetGenerateBtn(); return; }
  currentTaskId = taskId;

  // Poll
  let attempt = 0;
  const maxAttempts = 90;
  const pollInterval = setInterval(async () => {
    attempt++;
    const pr = await API.getTask(taskId);
    if (!pr.ok) return;
    const task = pr.data?.data;
    updateTaskStatus(task?.stateText || 'processing', attempt, maxAttempts);

    if (task?.state === 2) {
      clearInterval(pollInterval);
      resetGenerateBtn();
      hideTaskStatus();
      showResults(task, provider, model);
      showToast(i18n.t('task_success'), 'success');
    } else if (task?.state === 3) {
      clearInterval(pollInterval);
      resetGenerateBtn();
      hideTaskStatus();
      showToast(task?.errorMessage || i18n.t('task_failed'), 'error');
      if (resultContainer) resultContainer.innerHTML = `<div class="result-error"><p>❌ ${task?.errorMessage || i18n.t('task_failed')}</p></div>`;
    }

    if (attempt >= maxAttempts) {
      clearInterval(pollInterval);
      resetGenerateBtn();
      hideTaskStatus();
      showToast('Timeout: task terlalu lama', 'error');
    }
  }, 4000);
}

function buildInput(provider, model, prompt) {
  const m = model.toLowerCase();
  const input = { prompt };

  const g = (id) => document.getElementById(id)?.value;
  const gc = (id) => document.getElementById(id)?.checked;

  if (g('pg-aspect-ratio')) input.aspectRatio = g('pg-aspect-ratio');
  if (g('pg-steps')) input.steps = parseInt(g('pg-steps')) || 28;
  if (g('pg-negative-prompt')) input.negativePrompt = g('pg-negative-prompt');
  if (g('pg-seed')) input.seed = parseInt(g('pg-seed')) || -1;
  if (g('pg-file-url')) input.imageUrl = g('pg-file-url'), input.audioUrl = g('pg-file-url'), input.fileUrl = g('pg-file-url');
  if (g('pg-duration')) input.duration = parseInt(g('pg-duration')) || 5;
  if (g('pg-temperature')) input.temperature = parseFloat(g('pg-temperature')) || 0.7;
  if (g('pg-max-tokens')) input.maxTokens = parseInt(g('pg-max-tokens')) || 2048;
  if (g('pg-style')) input.style = g('pg-style'), input.tags = g('pg-style');
  if (g('pg-title')) input.title = g('pg-title');
  if (g('pg-lyrics')) input.lyrics = g('pg-lyrics');
  if (gc('pg-instrumental') !== undefined) input.makeInstrumental = gc('pg-instrumental');
  if (g('pg-vocal-gender')) input.vocalGender = g('pg-vocal-gender');
  if (g('pg-style-weight')) input.styleWeight = parseFloat(g('pg-style-weight')) || 1;
  if (g('pg-audio-weight')) input.audioWeight = parseFloat(g('pg-audio-weight')) || 1;
  if (g('pg-target-loudness')) input.targetLoudness = parseFloat(g('pg-target-loudness')) || -14;
  if (g('pg-ceiling')) input.ceiling = parseFloat(g('pg-ceiling')) || -0.3;
  if (g('pg-output-format')) input.outputFormat = g('pg-output-format');
  if (g('pg-sample-rate')) input.samplingRate = parseInt(g('pg-sample-rate')) || 44100;
  if (g('pg-low-cut')) input.lowCutFreq = parseFloat(g('pg-low-cut')) || 20;
  if (g('pg-high-cut')) input.highCutFreq = parseFloat(g('pg-high-cut')) || 20000;
  if (gc('pg-preserve-bass') !== undefined) input.preserveBass = gc('pg-preserve-bass');
  if (g('pg-algorithm')) input.algorithm = g('pg-algorithm');
  if (g('pg-ref-audio-url')) input.referenceAudioUrl = g('pg-ref-audio-url');

  // Multi reference images
  for (let n = 2; n <= 5; n++) {
    const v = g(`pg-file-url-${n}`);
    if (v) input[`photo${n}`] = v, input[`referenceImage${n}`] = v;
  }

  return input;
}

function showResults(task, provider, model) {
  const rc = document.getElementById('result-container');
  const ra = document.getElementById('result-actions');
  if (!rc) return;

  const resultJson = task?.resultJson;
  const urls = resultJson?.resultUrls || resultJson?.urls || [];
  const content = resultJson?.content || '';
  currentResultUrls = urls;

  const m = model.toLowerCase();
  const isChat = m.includes('chat') || m.includes('deepseek') || m.includes('gemini') || m.includes('grok') || m.includes('coder') || m.includes('reasoner') || m.includes('flash') || m.includes('pro');
  const isAudio = m.includes('suno') || m.includes('music') || m.includes('audio') || m.includes('master') || m.includes('cover') || m.includes('lyrics') || m.includes('extend');
  const isVideo = m.includes('video') || m.includes('wan') || m.includes('kling') || m.includes('hailuo');

  if (isChat || content) {
    rc.innerHTML = `
      <div class="result-chat-box">
        <div class="result-chat-header">
          <span>🤖 ${formatModelName(model)}</span>
          <button class="btn btn-xs btn-ghost" onclick="copyToClipboard(document.getElementById('chat-result-text').textContent)">📋 Salin</button>
        </div>
        <div class="result-chat-content" id="chat-result-text">${marked(content || JSON.stringify(resultJson, null, 2))}</div>
        ${resultJson?.reasoning ? `<details class="reasoning-box"><summary>🧠 Reasoning</summary><div>${resultJson.reasoning}</div></details>` : ''}
      </div>`;
    if (ra) ra.style.display = 'none';
    return;
  }

  if (!urls.length) {
    rc.innerHTML = `<div class="result-error"><p>⚠️ Tidak ada URL hasil yang ditemukan.</p><pre>${JSON.stringify(resultJson, null, 2)}</pre></div>`;
    return;
  }

  if (ra) ra.style.display = '';

  if (isAudio) {
    rc.innerHTML = urls.map((url, i) => `
      <div class="result-audio-card">
        <div class="audio-waveform">🎵</div>
        <p class="audio-title">${resultJson?.clips?.[i]?.title || `Track ${i+1}`}</p>
        <audio controls src="${url}" class="audio-player-full"></audio>
        <div class="audio-controls">
          <button class="btn btn-sm btn-primary" onclick="downloadFile('${url}', 'kreaverse-audio-${i+1}.mp3')">⬇️ Download MP3</button>
          <button class="btn btn-sm btn-ghost" onclick="copyToClipboard('${url}')">🔗 Copy URL</button>
        </div>
        ${resultJson?.clips?.[i]?.imageUrl ? `<img src="${resultJson.clips[i].imageUrl}" class="audio-cover-img" alt="cover">` : ''}
      </div>`).join('');
    return;
  }

  if (isVideo) {
    rc.innerHTML = urls.map((url, i) => `
      <div class="result-video-card">
        <video controls class="result-video" src="${url}" poster="">
          Browser tidak mendukung video.
        </video>
        <div class="video-controls">
          <button class="btn btn-sm btn-primary" onclick="downloadFile('${url}', 'kreaverse-video-${i+1}.mp4')">⬇️ Download Video</button>
          <button class="btn btn-sm btn-ghost" onclick="copyToClipboard('${url}')">🔗 Copy URL</button>
        </div>
      </div>`).join('');
    return;
  }

  // Images
  rc.innerHTML = `<div class="result-image-grid">${urls.map((url, i) => `
    <div class="result-image-item">
      <img src="${url}" alt="Result ${i+1}" class="result-img" onclick="openLightbox('${url}')" loading="lazy">
      <div class="img-actions">
        <button class="btn btn-sm btn-primary" onclick="downloadFile('${url}', 'kreaverse-img-${i+1}.png')">⬇️ Unduh</button>
        <button class="btn btn-sm btn-ghost" onclick="openLightbox('${url}')">🔍 Lihat Full</button>
      </div>
    </div>`).join('')}</div>`;
}

function openLightbox(url) {
  const lb = document.createElement('div');
  lb.className = 'lightbox-overlay';
  lb.onclick = () => lb.remove();
  lb.innerHTML = `
    <div class="lightbox-inner" onclick="event.stopPropagation()">
      <img src="${url}" alt="Full View">
      <div class="lightbox-controls">
        <button class="btn btn-sm btn-primary" onclick="downloadFile('${url}','kreaverse-full.png')">⬇️ Download</button>
        <button class="btn btn-sm btn-ghost" onclick="this.closest('.lightbox-overlay').remove()">✕ Tutup</button>
      </div>
    </div>`;
  document.body.appendChild(lb);
  requestAnimationFrame(() => lb.classList.add('active'));
}

async function downloadAllResults() {
  for (let i = 0; i < currentResultUrls.length; i++) {
    await new Promise(r => setTimeout(r, 500 * i));
    downloadFile(currentResultUrls[i], `kreaverse-ai-${i+1}`);
  }
}

function showTaskStatus(text) {
  const el = document.getElementById('task-status');
  const progress = document.getElementById('status-progress');
  const statusText = document.getElementById('status-text');
  if (el) el.style.display = 'block';
  if (progress) progress.style.width = '10%';
  if (statusText) statusText.textContent = text;
}

function updateTaskStatus(state, attempt, max) {
  const progress = document.getElementById('status-progress');
  const statusText = document.getElementById('status-text');
  const pct = Math.min(90, (attempt / max) * 100);
  if (progress) progress.style.width = `${pct}%`;
  const stateMap = { pending: 'Menunggu...', processing: 'Memproses AI...', success: 'Selesai!', failed: 'Gagal' };
  if (statusText) statusText.textContent = stateMap[state] || `${i18n.t('task_processing')} (${attempt}/${max})`;
}

function hideTaskStatus() {
  const el = document.getElementById('task-status');
  if (el) el.style.display = 'none';
}

function resetGenerateBtn() {
  const btn = document.getElementById('generate-btn');
  const btnText = document.getElementById('generate-btn-text');
  if (btn) btn.disabled = false;
  if (btnText) btnText.innerHTML = '✨ Generate';
}

// Simple marked.js fallback
function marked(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
async function renderDashboardPage(main) {
  if (!Auth.isLoggedIn()) { showLoginModal(); return; }

  main.innerHTML = `<div class="page-loading"><div class="spinner"></div></div>`;

  const [dashR, creditsR, apiKeysR] = await Promise.all([
    API.getDashboard(), API.getCredits(), API.getApiKeys()
  ]);

  const dash = dashR.data?.data;
  const credits = creditsR.data?.data;
  const apiKeys = apiKeysR.data?.data || [];

  main.innerHTML = `
  <div class="dashboard-layout">
    <div class="container">
      <h1 class="page-title">👤 Dashboard</h1>

      <!-- Subscription Status -->
      <div class="dash-cards-row">
        <div class="dash-card ${credits?.isActive ? 'card-active' : 'card-inactive'}">
          <div class="dash-card-icon">${credits?.isActive ? '✅' : '❌'}</div>
          <div class="dash-card-body">
            <h3>${credits?.isActive ? 'Langganan Aktif' : 'Langganan Tidak Aktif'}</h3>
            <p>${credits?.isActive ? `${credits.daysRemaining} ${i18n.t('dash_days_left')}` : 'Silakan berlangganan'}</p>
            ${credits?.subscriptionEnd ? `<small>Berakhir: ${new Date(credits.subscriptionEnd).toLocaleDateString('id-ID')}</small>` : ''}
          </div>
          ${!credits?.isActive ? `<button class="btn btn-primary btn-sm" data-route="/payment">Berlangganan</button>` : ''}
        </div>
        <div class="dash-card">
          <div class="dash-card-icon">⚡</div>
          <div class="dash-card-body">
            <h3>Task Aktif</h3>
            <p class="big-num">${dash?.activeTasks || 0}</p>
          </div>
        </div>
        <div class="dash-card">
          <div class="dash-card-icon">📥</div>
          <div class="dash-card-body">
            <h3>Total Unduhan</h3>
            <p class="big-num">${dash?.recentDownloads?.length || 0}</p>
          </div>
        </div>
      </div>

      <!-- Referral Code -->
      <div class="dash-section">
        <h2>🎁 Kode Undangan</h2>
        <div class="referral-box">
          <div class="referral-code-display" id="ref-code-display">Memuat...</div>
          <button class="btn btn-outline btn-sm" onclick="copyReferralCode()">📋 Salin Kode</button>
          <button class="btn btn-ghost btn-sm" data-route="/referral">Kelola Referral</button>
        </div>
        <p class="text-muted">Bagikan kode ini ke teman. Setiap teman yang mendaftar = 3 hari trial gratis untuk Anda!</p>
      </div>

      <!-- Recent Tasks -->
      <div class="dash-section">
        <div class="section-header-flex">
          <h2>📋 Riwayat Task Terbaru</h2>
          <div class="filter-tabs">
            <button class="filter-tab active" onclick="filterHistory('all',this)">Semua</button>
            <button class="filter-tab" onclick="filterHistory('image',this)">Gambar</button>
            <button class="filter-tab" onclick="filterHistory('video',this)">Video</button>
            <button class="filter-tab" onclick="filterHistory('audio',this)">Audio</button>
            <button class="filter-tab" onclick="filterHistory('chat',this)">Chat</button>
          </div>
        </div>
        <div class="tasks-list" id="tasks-list">
          ${renderTasksList(dash?.recentTasks || [])}
        </div>
      </div>

      <!-- API Keys Manager -->
      <div class="dash-section">
        <div class="section-header-flex">
          <h2>🔑 API Key Saya</h2>
          <button class="btn btn-primary btn-sm" onclick="showAddApiKeyModal()">+ Tambah API Key</button>
        </div>
        <div class="api-keys-list" id="api-keys-list">
          ${renderApiKeysList(apiKeys)}
        </div>
      </div>
    </div>
  </div>

  <!-- Add API Key Modal -->
  <div id="add-apikey-modal" class="modal-overlay">
    <div class="modal-box">
      <h3>🔑 Tambah API Key</h3>
      <div class="form-group">
        <label>Provider</label>
        <select id="ak-provider" class="form-control">
          ${['kie-ai','api-box','apiframe','crun','sunoapi','evolink','aimastering','deepseek','leonardo','gemini','grok']
            .map(p => `<option value="${p}">${p}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Label (opsional)</label>
        <input type="text" id="ak-label" class="form-control" placeholder="Nama untuk API key ini">
      </div>
      <div class="form-group">
        <label>API Key</label>
        <input type="password" id="ak-value" class="form-control" placeholder="sk-xxxx...">
        <button class="btn btn-xs btn-ghost" onclick="toggleAkVisibility()">👁️ Tampilkan</button>
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" onclick="submitAddApiKey()">Simpan</button>
        <button class="btn btn-ghost" onclick="hideModal('add-apikey-modal')">Batal</button>
      </div>
    </div>
  </div>
  `;

  // Load referral code
  const refR = await API.getMyCode();
  const refEl = document.getElementById('ref-code-display');
  if (refEl && refR.ok) refEl.textContent = refR.data?.data?.code || '-';
}

function renderTasksList(tasks) {
  if (!tasks?.length) return '<p class="empty-state">Belum ada task. <a data-route="/playground">Coba playground</a>!</p>';
  const stateColors = { 0: 'gray', 1: 'blue', 2: 'green', 3: 'red' };
  const stateText = { 0: 'Pending', 1: 'Processing', 2: 'Selesai', 3: 'Gagal' };
  const catEmoji = { image: '🖼️', video: '🎬', audio: '🎵', chat: '💬' };
  return tasks.map(t => `
    <div class="task-item task-state-${stateColors[t.state]}">
      <div class="task-icon">${catEmoji[t.category] || '🤖'}</div>
      <div class="task-info">
        <div class="task-title">${t.provider} / ${t.model}</div>
        <div class="task-meta">${new Date(t.created_at || t.createdAt).toLocaleString('id-ID')}</div>
      </div>
      <div class="task-state-badge state-${stateColors[t.state]}">${stateText[t.state]}</div>
      ${t.state === 2 ? `<button class="btn btn-sm btn-ghost" onclick="viewTaskResult('${t.id || t.taskId}')">👁️ Lihat</button>` : ''}
    </div>`).join('');
}

function renderApiKeysList(keys) {
  if (!keys?.length) return '<p class="empty-state">Belum ada API key. Tambahkan untuk menggunakan API key sendiri.</p>';
  const statusIcon = { active: '🟢', inactive: '🔴', unknown: '⚪', error: '🟡' };
  return keys.map(k => `
    <div class="api-key-item">
      <div class="ak-info">
        <span class="ak-provider">${k.provider}</span>
        <span class="ak-label">${k.label || k.provider}</span>
        <span class="ak-preview">${k.keyPreview}</span>
        <span class="ak-status">${statusIcon[k.status] || '⚪'} ${k.status || 'unknown'}</span>
      </div>
      <div class="ak-actions">
        <button class="btn btn-xs btn-ghost" onclick="checkApiKey('${k.id}')">🔍 Cek</button>
        <button class="btn btn-xs btn-danger" onclick="deleteApiKey('${k.id}')">🗑️</button>
        <a href="${getProviderDocsUrl(k.provider)}" target="_blank" class="btn btn-xs btn-outline">🔗 Get Key</a>
      </div>
    </div>`).join('');
}

function getProviderDocsUrl(provider) {
  const urls = {
    'kie-ai': 'https://kie.ai/dashboard/api-keys',
    'api-box': 'https://apibox.cc/dashboard',
    'apiframe': 'https://apiframe.pro/dashboard',
    'crun': 'https://crun.ai/dashboard',
    'sunoapi': 'https://sunoapi.org/dashboard',
    'evolink': 'https://evolink.ai/dashboard',
    'aimastering': 'https://aimastering.com/app#/dashboard',
    'deepseek': 'https://platform.deepseek.com/api_keys',
    'leonardo': 'https://app.leonardo.ai/settings/api-keys',
    'gemini': 'https://aistudio.google.com/app/apikey',
    'grok': 'https://console.x.ai'
  };
  return urls[provider] || '#';
}

function copyReferralCode() {
  const code = document.getElementById('ref-code-display')?.textContent;
  if (code && code !== 'Memuat...') copyToClipboard(code);
}

async function filterHistory(cat, btn) {
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const r = await API.getHistory(cat === 'all' ? '' : cat);
  const list = document.getElementById('tasks-list');
  if (list && r.ok) list.innerHTML = renderTasksList(r.data?.data);
}

function showAddApiKeyModal() { showModal('add-apikey-modal'); }
function toggleAkVisibility() {
  const input = document.getElementById('ak-value');
  if (input) input.type = input.type === 'password' ? 'text' : 'password';
}

async function submitAddApiKey() {
  const provider = document.getElementById('ak-provider')?.value;
  const apiKey = document.getElementById('ak-value')?.value;
  const label = document.getElementById('ak-label')?.value;
  if (!provider || !apiKey) { showToast('Provider dan API key wajib', 'error'); return; }
  const r = await API.addApiKey({ provider, apiKey, label });
  if (r.ok) {
    hideModal('add-apikey-modal');
    showToast('API key ditambahkan!', 'success');
    const keysR = await API.getApiKeys();
    const list = document.getElementById('api-keys-list');
    if (list && keysR.ok) list.innerHTML = renderApiKeysList(keysR.data?.data);
  } else {
    showToast(r.data?.message || 'Gagal menambahkan API key', 'error');
  }
}

async function checkApiKey(id) {
  showToast('Mengecek status...', 'info', 2000);
  const r = await API.checkApiKey(id);
  if (r.ok) {
    showToast(`Status: ${r.data?.data?.status}`, r.data?.data?.status === 'active' ? 'success' : 'warning');
    const keysR = await API.getApiKeys();
    const list = document.getElementById('api-keys-list');
    if (list && keysR.ok) list.innerHTML = renderApiKeysList(keysR.data?.data);
  }
}

async function deleteApiKey(id) {
  if (!confirm('Hapus API key ini?')) return;
  const r = await API.deleteApiKey(id);
  if (r.ok) {
    showToast('API key dihapus', 'success');
    const keysR = await API.getApiKeys();
    const list = document.getElementById('api-keys-list');
    if (list && keysR.ok) list.innerHTML = renderApiKeysList(keysR.data?.data);
  }
}

async function viewTaskResult(taskId) {
  const r = await API.getTask(taskId);
  if (r.ok && r.data?.data?.state === 2) {
    navigate('/playground');
    setTimeout(() => {
      const task = r.data.data;
      const provider = task.provider;
      const model = task.model;
      showResults(task, provider, model);
    }, 800);
  }
}

// ─── PAYMENT PAGE ─────────────────────────────────────────────────────────────
async function renderPaymentPage(main) {
  const r = await API.getPaymentInfo();
  const info = r.data?.data || {};
  const price = Number(info.price || 700000).toLocaleString('id-ID');
  const waText = info.whatsappText || encodeURIComponent(`Halo Admin Kreaverse AI,\n\nSaya ingin konfirmasi pembayaran:\n📦 Paket: Unlimited 3 Bulan\n💰 Harga: Rp ${price}\n\nMohon aktivasi akun saya.\nTerima kasih!`);
  const waUrl = `https://wa.me/${info.whatsappNumber || '6285119821813'}?text=${waText}`;

  main.innerHTML = `
  <div class="payment-page">
    <div class="container">
      <div class="payment-header">
        <h1 data-i18n="pay_title">💎 Langganan Kreaverse AI</h1>
        <p data-i18n="pay_subtitle">Akses unlimited 11 provider AI</p>
      </div>

      <div class="payment-layout">
        <!-- Features Card -->
        <div class="payment-features-card">
          <h2>✨ Yang Kamu Dapatkan</h2>
          <ul class="feature-list">
            <li>✅ Akses semua 11 Provider AI tanpa batas</li>
            <li>✅ 50+ Model AI (Gambar, Video, Audio, Chat)</li>
            <li>✅ Generate tanpa limit selama 3 bulan</li>
            <li>✅ Download HQ tanpa watermark</li>
            <li>✅ AI Mastering audio profesional</li>
            <li>✅ Music Cover AI dengan equalizer</li>
            <li>✅ Image to Image & Video AI</li>
            <li>✅ Support WhatsApp prioritas</li>
            <li>✅ Update model terbaru otomatis</li>
          </ul>
          <div class="price-highlight">
            <span class="price-big">Rp ${price}</span>
            <span class="price-period">/ 3 Bulan</span>
          </div>
        </div>

        <!-- QR Payment Card -->
        <div class="payment-qr-card">
          <h2>📱 Cara Pembayaran</h2>
          <div class="payment-steps">
            <div class="pay-step">1. Scan QR code di bawah</div>
            <div class="pay-step">2. Transfer ke rekening yang tertera</div>
            <div class="pay-step">3. Klik "Konfirmasi via WhatsApp"</div>
            <div class="pay-step">4. Tunggu aktivasi dalam 1×24 jam</div>
          </div>
          <div class="qr-container">
            <img src="${info.qrCode || '/images/payment-qr.png'}" alt="QR Pembayaran" class="qr-image"
                 onerror="this.src='/images/payment-qr.png'">
            <p class="qr-caption">Scan untuk Transfer</p>
          </div>
          <a href="${waUrl}" target="_blank" class="btn btn-whatsapp btn-full">
            <span>💬</span> Konfirmasi via WhatsApp
          </a>
          <p class="pay-note">* Akun akan diaktivasi admin setelah konfirmasi diterima</p>
        </div>
      </div>
    </div>
  </div>`;
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
async function renderAboutPage(main) {
  main.innerHTML = `
  <div class="about-page">
    <div class="container">
      <div class="about-hero">
        <img src="/images/logo.png" alt="Kreaverse AI" class="about-logo">
        <h1 data-i18n="about_title">Tentang Kreaverse AI</h1>
        <p data-i18n="about_desc">Kreaverse AI (sebelumnya HABI STUDIO AI) adalah platform agregasi AI terdepan di Indonesia.</p>
      </div>

      <div class="about-section">
        <h2>🎯 Misi Kami</h2>
        <p>Menghadirkan semua tool AI terbaik dunia dalam satu platform yang mudah digunakan oleh siapa saja, dari kreator konten hingga developer profesional.</p>
      </div>

      <div class="about-section">
        <h2>🤝 11 Provider AI</h2>
        <div class="about-providers-grid">
          ${[
            {id:'kie-ai',name:'Kie AI',desc:'Image, Video, Audio, Chat AI'},
            {id:'api-box',name:'API Box',desc:'Flux, SDXL, Midjourney, DALL·E'},
            {id:'apiframe',name:'Apiframe.ai',desc:'Midjourney, Faceswap, Flux Pro'},
            {id:'crun',name:'Crun.ai',desc:'Image, Video, Audio Generation'},
            {id:'sunoapi',name:'SunoAPI.org',desc:'Music Generation AI'},
            {id:'evolink',name:'Evolink.ai',desc:'Flux, SD, Video AI'},
            {id:'aimastering',name:'AI Mastering',desc:'Professional Audio Mastering'},
            {id:'deepseek',name:'DeepSeek',desc:'Advanced Chat & Coding AI'},
            {id:'leonardo',name:'Leonardo.ai',desc:'Phoenix, Flux, Alchemy Image AI'},
            {id:'gemini',name:'Gemini AI',desc:'Google Multimodal AI'},
            {id:'grok',name:'Grok AI',desc:'xAI Chat & Aurora Image AI'}
          ].map(p => `
          <div class="about-provider-card">
            <img src="/images/providers/${p.id}.png" alt="${p.name}" class="about-provider-logo"
                 onerror="this.style.display='none'">
            <div>
              <h4>${p.name}</h4>
              <p>${p.desc}</p>
            </div>
          </div>`).join('')}
        </div>
      </div>

      <div class="about-section about-contact">
        <h2>📞 Kontak & Support</h2>
        <a href="https://wa.me/6285119821813" target="_blank" class="btn btn-whatsapp">
          💬 WhatsApp Support
        </a>
      </div>
    </div>
  </div>`;
}

// ─── DOCS PAGE ────────────────────────────────────────────────────────────────
async function renderDocsPage(main) {
  main.innerHTML = `
  <div class="docs-page">
    <div class="container">
      <h1>📚 Dokumentasi API Kreaverse AI</h1>
      <p class="docs-intro">Base URL: <code>${window.location.origin}</code></p>

      <div class="docs-layout">
        <nav class="docs-nav">
          <a href="#auth">Authentication</a>
          <a href="#create-task">Create Task</a>
          <a href="#record-info">Record Info</a>
          <a href="#download">Download</a>
          <a href="#user">User Credits</a>
          <a href="#models">Models</a>
        </nav>
        <div class="docs-content">

          <div class="doc-section" id="auth">
            <h2>🔑 Authentication</h2>
            <p>Semua endpoint memerlukan JWT Bearer token (kecuali login).</p>
            <div class="code-block">
              <pre>Authorization: Bearer &lt;your_token&gt;</pre>
            </div>
            <h3>POST /api/auth/login</h3>
            <div class="code-block">
              <pre>${JSON.stringify({email:"user@example.com",password:"yourpassword"},null,2)}</pre>
            </div>
            <h4>Response:</h4>
            <div class="code-block">
              <pre>${JSON.stringify({success:true,data:{token:"eyJhbGc...",user:{id:"...",email:"...",role:"user"}}},null,2)}</pre>
            </div>
          </div>

          <div class="doc-section" id="create-task">
            <h2>🚀 POST /api/v1/jobs/createTask</h2>
            <p>Membuat task generate AI. Mendukung multipart/form-data untuk upload file.</p>
            <div class="code-block">
              <pre>${JSON.stringify({provider:"kie-ai",model:"flux",input:{prompt:"A beautiful sunset",width:1024,height:1024},useOwnKey:false},null,2)}</pre>
            </div>
            <h4>Response:</h4>
            <div class="code-block">
              <pre>${JSON.stringify({success:true,data:{taskId:"uuid-xxx",state:0,message:"Task sedang diproses..."}},null,2)}</pre>
            </div>
          </div>

          <div class="doc-section" id="record-info">
            <h2>📊 GET /api/v1/jobs/recordInfo</h2>
            <p>Cek status task. State: 0=pending, 1=processing, 2=success, 3=failed</p>
            <div class="code-block">
              <pre>GET /api/v1/jobs/recordInfo?taskId=uuid-xxx</pre>
            </div>
            <h4>Response (state 2 - sukses):</h4>
            <div class="code-block">
              <pre>${JSON.stringify({success:true,data:{taskId:"uuid",state:2,stateText:"success",resultJson:{resultUrls:["https://cdn.example.com/result.png"]}}},null,2)}</pre>
            </div>
          </div>

          <div class="doc-section" id="download">
            <h2>⬇️ GET /api/v1/common/download-url</h2>
            <p>Proxy unduhan file hasil generate.</p>
            <div class="code-block">
              <pre>GET /api/v1/common/download-url?taskId=uuid-xxx
GET /api/v1/common/download-url?url=https://cdn.example.com/file.mp3</pre>
            </div>
          </div>

          <div class="doc-section" id="user">
            <h2>👤 GET /api/v1/user/credits</h2>
            <div class="code-block">
              <pre>${JSON.stringify({success:true,data:{isActive:true,isUnlimited:true,daysRemaining:89,plan:"unlimited"}},null,2)}</pre>
            </div>
          </div>

          <div class="doc-section" id="models">
            <h2>🤖 GET /api/v1/common/models</h2>
            <p>Daftar semua provider dan model yang tersedia.</p>
            <div class="code-block">
              <pre>${JSON.stringify({"kie-ai":[{provider:"kie-ai",model:"flux"},{provider:"kie-ai",model:"seedream"}],"deepseek":[{provider:"deepseek",model:"deepseek-chat"}]},null,2)}</pre>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>`;
}

// ─── REFERRAL PAGE ────────────────────────────────────────────────────────────
async function renderReferralPage(main) {
  if (!Auth.isLoggedIn()) { showLoginModal(); return; }

  const [codeR, statsR] = await Promise.all([API.getMyCode(), API.getReferralStats()]);
  const code = codeR.data?.data?.code || '-';
  const stats = statsR.data?.data || {};

  main.innerHTML = `
  <div class="referral-page">
    <div class="container">
      <h1>🎁 Program Undang Teman</h1>
      <p>Setiap teman yang mendaftar menggunakan kode kamu = <strong>3 hari trial gratis</strong> untuk kamu!</p>

      <div class="referral-card">
        <h2>Kode Undangan Anda</h2>
        <div class="big-code-display">${code}</div>
        <button class="btn btn-primary" onclick="copyToClipboard('${code}')">📋 Salin Kode</button>
        <button class="btn btn-whatsapp" onclick="shareReferral('${code}')">💬 Bagikan via WhatsApp</button>
      </div>

      <div class="referral-enter-card">
        <h2>Masukkan Kode Teman</h2>
        <p>Jika kamu baru bergabung dan punya kode undangan:</p>
        <div class="referral-input-group">
          <input type="text" id="ref-input" class="form-control" placeholder="Masukkan kode (contoh: ABC123)" maxlength="6" style="text-transform:uppercase">
          <button class="btn btn-primary" onclick="submitReferralCode()">Gunakan Kode</button>
        </div>
      </div>

      <div class="referral-stats">
        <h2>📊 Statistik Referral</h2>
        <div class="ref-stat-item">
          <span>Total Teman Diundang:</span>
          <strong>${stats.totalReferrals || 0}</strong>
        </div>
        <div class="referral-history">
          ${stats.referrals?.length ? stats.referrals.map(r => `
          <div class="ref-history-item">
            <span>${r.referred_email || r.referred_name}</span>
            <span>${new Date(r.rewarded_at).toLocaleDateString('id-ID')}</span>
          </div>`).join('') : '<p class="text-muted">Belum ada teman yang diundang.</p>'}
        </div>
      </div>
    </div>
  </div>`;
}

async function submitReferralCode() {
  const code = document.getElementById('ref-input')?.value?.trim()?.toUpperCase();
  if (!code) { showToast('Masukkan kode referral', 'error'); return; }
  const r = await API.useCode(code);
  if (r.ok) {
    showToast('Referral berhasil digunakan! Teman kamu mendapat 3 hari trial 🎉', 'success');
    document.getElementById('ref-input').value = '';
  } else {
    showToast(r.data?.message || 'Kode tidak valid', 'error');
  }
}

function shareReferral(code) {
  const text = `Hei! Daftar di Kreaverse AI – Platform AI Terlengkap Indonesia 🚀\nGunakan kode undangan ku: ${code}\nLink: ${window.location.origin}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// ─── CHAT PAGE ────────────────────────────────────────────────────────────────
async function renderChatPage(main) {
  if (!Auth.isLoggedIn()) { showLoginModal(); return; }

  showWatermark();

  main.innerHTML = `
  <div class="chat-layout">
    <!-- Sidebar -->
    <div class="chat-sidebar">
      <div class="chat-sidebar-header">
        <button class="btn btn-primary btn-full" onclick="newChat()">+ Chat Baru</button>
      </div>
      <div class="chat-model-selector">
        <label>Model AI</label>
        <select id="chat-model-select" class="form-control" onchange="onChatModelChange()">
          <optgroup label="DeepSeek">
            <option value="deepseek|deepseek-chat">DeepSeek Chat</option>
            <option value="deepseek|deepseek-reasoner">DeepSeek Reasoner</option>
            <option value="deepseek|deepseek-coder">DeepSeek Coder</option>
          </optgroup>
          <optgroup label="Gemini">
            <option value="gemini|gemini-2.0-flash">Gemini 2.0 Flash</option>
            <option value="gemini|gemini-1.5-pro">Gemini 1.5 Pro</option>
            <option value="gemini|gemini-1.5-flash">Gemini 1.5 Flash</option>
          </optgroup>
          <optgroup label="Grok">
            <option value="grok|grok-3">Grok 3</option>
            <option value="grok|grok-3-mini">Grok 3 Mini</option>
            <option value="grok|grok-2-vision">Grok Vision</option>
          </optgroup>
          <optgroup label="Kie AI">
            <option value="kie-ai|chat">Kie AI Chat</option>
          </optgroup>
        </select>
      </div>
      <div class="chat-api-toggle">
        <label class="toggle-wrap">
          <input type="checkbox" id="chat-use-server" checked>
          <span class="toggle-slider"></span>
        </label>
        <span id="chat-api-label">API Server</span>
      </div>
      <div class="chat-history-list" id="chat-history-list">
        <p class="text-muted">Riwayat chat muncul di sini</p>
      </div>
    </div>

    <!-- Chat Main -->
    <div class="chat-main">
      <div class="chat-messages" id="chat-messages">
        <div class="chat-welcome">
          <div class="chat-welcome-icon">🤖</div>
          <h2>Kreaverse AI Chat</h2>
          <p>Mulai percakapan dengan AI terpintar. Pilih model di kiri, lalu ketik pesan.</p>
          <div class="chat-quick-prompts">
            ${['Buat puisi tentang teknologi AI','Jelaskan cara kerja neural network','Bantu saya menulis kode Python','Ceritakan tentang masa depan AI'].map(p=>
              `<button class="quick-prompt-btn" onclick="document.getElementById('chat-input').value='${p}';sendChatMessage()">${p}</button>`
            ).join('')}
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <div class="chat-input-toolbar">
          <button class="btn btn-xs btn-ghost" onclick="document.getElementById('chat-file-input').click()" title="Upload file">📎</button>
          <input type="file" id="chat-file-input" style="display:none" onchange="handleChatFileUpload(this)">
          <span id="chat-file-preview" class="chat-file-preview"></span>
        </div>
        <div class="chat-input-row">
          <textarea id="chat-input" class="chat-textarea" placeholder="Ketik pesan Anda... (Enter = kirim, Shift+Enter = baris baru)"
            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChatMessage()}"></textarea>
          <button class="btn btn-primary chat-send-btn" onclick="sendChatMessage()" id="chat-send-btn">
            <span>➤</span>
          </button>
        </div>
      </div>
    </div>
  </div>`;

  // API toggle
  document.getElementById('chat-use-server')?.addEventListener('change', function() {
    document.getElementById('chat-api-label').textContent = this.checked ? 'API Server' : 'API Sendiri';
  });
}

let chatMessages = []; // { role, content }
let chatFileUrl = '';

function newChat() {
  chatMessages = [];
  chatFileUrl = '';
  const container = document.getElementById('chat-messages');
  if (container) container.innerHTML = `<div class="chat-welcome"><div class="chat-welcome-icon">🤖</div><h2>Chat Baru Dimulai</h2><p>Ketik pesan pertama Anda.</p></div>`;
}

async function handleChatFileUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const preview = document.getElementById('chat-file-preview');
  if (preview) preview.textContent = 'Uploading...';
  const r = await API.upload(file);
  if (r.ok) {
    chatFileUrl = r.data.data.url;
    if (preview) preview.innerHTML = `📎 ${file.name} <button onclick="chatFileUrl='';this.parentElement.textContent=''">✕</button>`;
  }
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input?.value?.trim();
  if (!text) return;

  const modelVal = document.getElementById('chat-model-select')?.value || 'deepseek|deepseek-chat';
  const [provider, model] = modelVal.split('|');
  const useServerApi = document.getElementById('chat-use-server')?.checked;

  input.value = '';
  appendChatBubble('user', text);

  chatMessages.push({ role: 'user', content: chatFileUrl ? `${text}\n[Image: ${chatFileUrl}]` : text });

  const thinkingId = appendChatBubble('assistant', '...', true);
  const btn = document.getElementById('chat-send-btn');
  if (btn) btn.disabled = true;

  const fd = new FormData();
  fd.append('data', JSON.stringify({
    provider, model,
    input: {
      messages: chatMessages.map(m => ({ role: m.role, content: m.content })),
      model,
      imageUrl: chatFileUrl || undefined
    },
    useOwnKey: !useServerApi
  }));

  chatFileUrl = '';
  const preview = document.getElementById('chat-file-preview');
  if (preview) preview.textContent = '';

  const r = await API.postForm('/api/v1/jobs/createTask', fd);
  if (!r.ok) {
    updateChatBubble(thinkingId, '❌ Error: ' + (r.data?.message || 'Gagal'));
    if (btn) btn.disabled = false;
    return;
  }

  const taskId = r.data?.data?.taskId;
  const pollResult = await API.pollTask(taskId, null, 60);

  if (pollResult.success) {
    const content = pollResult.task?.resultJson?.content || JSON.stringify(pollResult.task?.resultJson);
    updateChatBubble(thinkingId, content);
    chatMessages.push({ role: 'assistant', content });
  } else {
    updateChatBubble(thinkingId, '❌ ' + (pollResult.error || 'Gagal mendapat respons'));
  }

  if (btn) btn.disabled = false;
}

function appendChatBubble(role, content, isThinking = false) {
  const container = document.getElementById('chat-messages');
  const welcome = container?.querySelector('.chat-welcome');
  if (welcome) welcome.remove();

  const id = 'msg-' + Date.now();
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble chat-bubble-${role} ${isThinking ? 'thinking' : ''}`;
  bubble.id = id;
  bubble.innerHTML = `
    <div class="bubble-avatar">${role === 'user' ? '👤' : '🤖'}</div>
    <div class="bubble-content">
      <div class="bubble-text">${isThinking ? '<div class="typing-indicator"><span></span><span></span><span></span></div>' : marked(content)}</div>
      <div class="bubble-actions">
        <button class="btn btn-xs btn-ghost" onclick="copyToClipboard(this.closest('.bubble-content').querySelector('.bubble-text').textContent)">📋</button>
      </div>
    </div>`;

  container?.appendChild(bubble);
  container?.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  return id;
}

function updateChatBubble(id, content) {
  const bubble = document.getElementById(id);
  if (bubble) {
    bubble.classList.remove('thinking');
    const textEl = bubble.querySelector('.bubble-text');
    if (textEl) textEl.innerHTML = marked(content);
    const container = document.getElementById('chat-messages');
    container?.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }
}

window.renderHomePage = renderHomePage;
window.renderPlaygroundPage = renderPlaygroundPage;
window.renderDashboardPage = renderDashboardPage;
window.renderPaymentPage = renderPaymentPage;
window.renderAboutPage = renderAboutPage;
window.renderDocsPage = renderDocsPage;
window.renderReferralPage = renderReferralPage;
window.renderChatPage = renderChatPage;
window.handleGenerate = handleGenerate;
window.handleFileUpload = handleFileUpload;
window.handleMultiUpload = handleMultiUpload;
window.handleRefAudioUpload = handleRefAudioUpload;
window.downloadAllResults = downloadAllResults;
window.onProviderChange = onProviderChange;
window.onModelChange = onModelChange;
window.filterHistory = filterHistory;
window.showAddApiKeyModal = showAddApiKeyModal;
window.submitAddApiKey = submitAddApiKey;
window.checkApiKey = checkApiKey;
window.deleteApiKey = deleteApiKey;
window.viewTaskResult = viewTaskResult;
window.submitReferralCode = submitReferralCode;
window.shareReferral = shareReferral;
window.openLightbox = openLightbox;
window.newChat = newChat;
window.sendChatMessage = sendChatMessage;
window.handleChatFileUpload = handleChatFileUpload;
window.copyReferralCode = copyReferralCode;
window.toggleAkVisibility = toggleAkVisibility;