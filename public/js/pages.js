function renderHome(container) {
  container.innerHTML = `
    <section class="hero" style="text-align:center; padding:4rem 1rem; background: radial-gradient(circle at center, #1A1D24 0%, #0B0E14 100%);">
      <h1 style="font-size:2.8rem; background: linear-gradient(90deg, #3182CE, #D53F8C); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${t('heroTitle')}</h1>
      <p style="font-size:1.2rem;">${t('heroSub')}</p>
      <div style="margin-top:2rem;">
        <a href="#/playground" class="btn btn-primary">${t('tryNow')}</a>
        <a href="#/layanan" class="btn btn-outline" style="margin-left:1rem;">${t('viewServices')}</a>
      </div>
    </section>
    <div class="container grid grid-4">
      <div class="card text-center"><div style="font-size:2rem;">🖼️</div><h3>${t('categoryImage')}</h3></div>
      <div class="card text-center"><div style="font-size:2rem;">🎥</div><h3>${t('categoryVideo')}</h3></div>
      <div class="card text-center"><div style="font-size:2rem;">🎵</div><h3>${t('categoryAudio')}</h3></div>
      <div class="card text-center"><div style="font-size:2rem;">💬</div><h3>${t('categoryChat')}</h3></div>
    </div>
    <div class="container" style="background:var(--surface); padding:1.5rem; text-align:center; margin:2rem auto; border-radius:1rem; font-size:1.2rem;">
      ${t('audioBanner')}
    </div>
    <div class="container grid grid-2">
      <div class="card text-center"><h3>Langganan Premium</h3><p>Rp 700.000 / 3 bulan</p><a href="#/pembayaran" class="btn btn-primary mt-2">Langganan</a></div>
      <div class="card text-center"><h3>API Key Pribadi</h3><p>Gunakan API key sendiri</p><a href="#/dashboard" class="btn btn-outline mt-2">Kelola</a></div>
    </div>
  `;
}

function renderTools(container) {
  container.innerHTML = `
    <div class="container">
      <h2>${t('tools')}</h2>
      <div class="grid grid-3">
        <div class="card"><h4>Kie AI</h4><p>Seedream, Flux, Kling</p></div>
        <div class="card"><h4>API Box</h4></div>
        <div class="card"><h4>Apiframe.ai</h4></div>
        <div class="card"><h4>Crun.ai</h4></div>
        <div class="card"><h4>SunoAPI.org</h4><p>Music</p></div>
        <div class="card"><h4>Evolink.ai</h4></div>
        <div class="card"><h4>AI Mastering</h4></div>
        <div class="card"><h4>DeepSeek</h4><p>Chat</p></div>
        <div class="card"><h4>Leonardo.ai</h4><p>Image</p></div>
        <div class="card"><h4>Gemini AI</h4><p>Chat</p></div>
        <div class="card"><h4>Grok AI</h4><p>Chat</p></div>
      </div>
    </div>
  `;
}

function renderPlayground(container) {
  if (!isLoggedIn()) { window.location.hash = '#/login'; return; }
  container.innerHTML = `
    <div class="container">
      <h2>${t('playground')}</h2>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2rem;">
        <div class="card">
          <div class="form-group"><label>Provider</label><select id="providerSelect" onchange="updateModels()"><option value="kie-ai">Kie AI</option><option value="api-box">API Box</option><option value="apiframe">Apiframe.ai</option><option value="crun">Crun.ai</option><option value="sunoapi">SunoAPI</option><option value="evolink">Evolink.ai</option><option value="aimastering">AI Mastering</option><option value="deepseek">DeepSeek</option><option value="leonardo">Leonardo.ai</option><option value="gemini">Gemini AI</option><option value="grok">Grok AI</option></select></div>
          <div class="form-group"><label>Model</label><select id="modelSelect"></select></div>
          <div class="form-group"><label>${t('inputPrompt')}</label><textarea id="promptInput" rows="3"></textarea></div>
          <div id="advancedParams"></div>
          <div class="form-group" id="fileUploadArea" style="display:none;"><label>${t('uploadFile')}</label><input type="file" id="fileInput" multiple></div>
          <div class="form-group"><label>API Key Mode</label><select id="apiKeyMode"><option value="server">Server</option><option value="personal">Pribadi</option></select></div>
          <button class="btn btn-primary" onclick="generate()">${t('generate')}</button>
          <div id="generationStatus" class="mt-2"></div>
        </div>
        <div class="card"><h3>${t('result')}</h3><div id="resultContainer"></div></div>
      </div>
    </div>
  `;
  updateModels();
}

function updateModels() {
  const provider = document.getElementById('providerSelect').value;
  const modelMap = {
    'kie-ai': ['seedream', 'flux', 'kling'],
    'api-box': ['default'],
    'apiframe': ['default'],
    'crun': ['default'],
    'sunoapi': ['music'],
    'evolink': ['default'],
    'aimastering': ['mastering'],
    'deepseek': ['chat'],
    'leonardo': ['image'],
    'gemini': ['chat'],
    'grok': ['chat']
  };
  const models = modelMap[provider] || [];
  document.getElementById('modelSelect').innerHTML = models.map(m => `<option value="${m}">${m}</option>`).join('');
  const advanced = document.getElementById('advancedParams');
  const fileUpload = document.getElementById('fileUploadArea');
  advanced.innerHTML = '';
  fileUpload.style.display = 'none';
  if (provider === 'aimastering') {
    fileUpload.style.display = 'block';
    advanced.innerHTML = `
      <div class="form-group"><label>Limiter</label><select id="limiter"><option value="true">Ya</option><option value="false">Tidak</option></select></div>
      <div class="form-group"><label>Target Loudness</label><input id="targetLoudness" value="-14"></div>
      <div class="form-group"><label>Ceiling</label><input id="ceiling" value="-1"></div>
      <div class="form-group"><label>Oversampling</label><select id="oversampling"><option value="none">None</option><option value="2x">2x</option><option value="4x">4x</option></select></div>
      <div class="form-group"><label>Output Format</label><select id="outputFormat"><option value="wav">WAV</option><option value="mp3">MP3</option></select></div>
      <div class="form-group"><label>Sampling Rate</label><input id="samplingRate" value="44100"></div>
      <div class="form-group"><label>Low Cut Freq</label><input id="lowCutFreq" value="20"></div>
      <div class="form-group"><label>High Cut Freq</label><input id="highCutFreq" value="20000"></div>
      <div class="form-group"><label>Preserve Bass</label><select id="preserveBass"><option value="true">Ya</option><option value="false">Tidak</option></select></div>
      <div class="form-group"><label>Algorithm</label><select id="algorithm"><option value="default">Default</option></select></div>
    `;
  } else if (provider === 'sunoapi') {
    fileUpload.style.display = 'block';
    advanced.innerHTML = `
      <div class="form-group"><label>Title</label><input id="title"></div>
      <div class="form-group"><label>Style</label><input id="style"></div>
      <div class="form-group"><label>Lyrics</label><textarea id="lyrics" rows="2"></textarea></div>
      <div class="form-group"><label>Vocal Gender</label><select id="vocalGender"><option>male</option><option>female</option></select></div>
      <div class="form-group"><label>Negative Tags</label><input id="negativeTags"></div>
      <div class="form-group"><label>Style Weight</label><input id="styleWeight" type="range" min="0" max="100" value="50"></div>
      <div class="form-group"><label>Weirdness Constraint</label><input id="weirdness" type="range" min="0" max="100" value="50"></div>
      <div class="form-group"><label>Audio Weight</label><input id="audioWeight" type="range" min="0" max="100" value="50"></div>
    `;
  } else if (provider === 'kie-ai' && document.getElementById('modelSelect').value === 'kling') {
    fileUpload.style.display = 'block';
    advanced.innerHTML = `<div class="form-group"><label>Duration (sec)</label><input id="duration" value="5"></div><div class="form-group"><label>Resolution</label><select id="resolution"><option value="720p">720p</option><option value="1080p">1080p</option></select></div>`;
  } else if (provider === 'kie-ai' && document.getElementById('modelSelect').value === 'seedream') {
    fileUpload.style.display = 'block';
    advanced.innerHTML = `<div class="form-group"><label>Reference Images (max 5)</label><input type="file" id="refImages" multiple></div><div class="form-group"><label>Aspect Ratio</label><select id="aspectRatio"><option>1:1</option><option>16:9</option><option>9:16</option></select></div>`;
  }
}

async function generate() {
  const provider = document.getElementById('providerSelect').value;
  const model = document.getElementById('modelSelect').value;
  const prompt = document.getElementById('promptInput').value;
  let input = { prompt };
  // advanced inputs
  if (provider === 'aimastering') {
    input.limiter = document.getElementById('limiter')?.value === 'true';
    input.target_loudness = parseFloat(document.getElementById('targetLoudness')?.value) || -14;
    input.ceiling = parseFloat(document.getElementById('ceiling')?.value) || -1;
    input.oversampling = document.getElementById('oversampling')?.value;
    input.output_format = document.getElementById('outputFormat')?.value;
    input.sampling_rate = parseInt(document.getElementById('samplingRate')?.value) || 44100;
    input.low_cut_freq = parseFloat(document.getElementById('lowCutFreq')?.value) || 20;
    input.high_cut_freq = parseFloat(document.getElementById('highCutFreq')?.value) || 20000;
    input.preserve_bass = document.getElementById('preserveBass')?.value === 'true';
    input.algorithm = document.getElementById('algorithm')?.value;
  }
  if (provider === 'sunoapi') {
    input.title = document.getElementById('title')?.value;
    input.style = document.getElementById('style')?.value;
    input.lyrics = document.getElementById('lyrics')?.value;
    input.vocal_gender = document.getElementById('vocalGender')?.value;
    input.negative_tags = document.getElementById('negativeTags')?.value;
    input.style_weight = document.getElementById('styleWeight')?.value;
    input.weirdness_constraint = document.getElementById('weirdness')?.value;
    input.audio_weight = document.getElementById('audioWeight')?.value;
  }
  if (provider === 'kie-ai' && model === 'kling') {
    input.duration = document.getElementById('duration')?.value;
    input.resolution = document.getElementById('resolution')?.value;
  }
  if (provider === 'kie-ai' && model === 'seedream') {
    input.aspect_ratio = document.getElementById('aspectRatio')?.value;
  }
  const usePersonal = document.getElementById('apiKeyMode')?.value === 'personal';
  // upload file
  const fileInput = document.getElementById('fileInput');
  if (fileInput && fileInput.files.length > 0) {
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    const uploadRes = await fetch('/api/v1/upload/file', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData
    }).then(r => r.json());
    if (uploadRes.success) input.file_url = uploadRes.data.url;
  }
  // multiple reference images
  const refImages = document.getElementById('refImages');
  if (refImages && refImages.files.length > 0) {
    input.reference_images = [];
    for (let i = 0; i < Math.min(refImages.files.length, 5); i++) {
      const formData = new FormData();
      formData.append('file', refImages.files[i]);
      const uploadRes = await fetch('/api/v1/upload/file', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData
      }).then(r => r.json());
      if (uploadRes.success) input.reference_images.push(uploadRes.data.url);
    }
  }

  document.getElementById('generationStatus').innerText = 'Membuat task...';
  try {
    const res = await apiRequest('/api/v1/jobs/createTask', {
      method: 'POST',
      body: JSON.stringify({ provider, model, input, usePersonalKey: usePersonal })
    });
    document.getElementById('generationStatus').innerText = 'Task ID: ' + res.data.taskId;
    pollTask(res.data.taskId);
  } catch (e) {
    alert(e.message);
  }
}

async function pollTask(taskId) {
  const res = await apiRequest(`/api/v1/jobs/recordInfo?taskId=${taskId}`);
  if (res.data.state === 2) {
    const urls = res.data.resultUrls || [];
    const resultDiv = document.getElementById('resultContainer');
    if (urls.length) {
      resultDiv.innerHTML = urls.map(u => {
        if (u.match(/\.(mp4|webm|mov)/i)) return `<video controls width="100%"><source src="${u}"></video>`;
        if (u.match(/\.(mp3|wav|ogg)/i)) return `<audio controls src="${u}" style="width:100%"></audio>`;
        return `<img src="${u}" style="width:100%; margin-bottom:0.5rem;">`;
      }).join('');
    } else if (res.data.result?.text) {
      resultDiv.innerHTML = `<div style="white-space:pre-wrap; background:var(--bg); padding:1rem; border-radius:0.5rem;">${res.data.result.text}</div>`;
    } else {
      resultDiv.innerText = 'Selesai.';
    }
    document.getElementById('generationStatus').innerText = 'Selesai.';
  } else if (res.data.state === 3) {
    document.getElementById('resultContainer').innerText = 'Gagal.';
    document.getElementById('generationStatus').innerText = 'Gagal.';
  } else {
    setTimeout(() => pollTask(taskId), 3000);
  }
}

function renderChat(container) {
  if (!isLoggedIn()) { window.location.hash = '#/login'; return; }
  container.innerHTML = `
    <div class="container" style="display:flex; flex-direction:column; height:80vh;">
      <h2>${t('chat')}</h2>
      <div class="card" style="flex:1; overflow-y:auto; margin-bottom:1rem;" id="chatMessages"><div>Mulai percakapan dengan AI.</div></div>
      <div class="card" style="display:flex; gap:0.5rem;">
        <select id="chatModel" style="width:auto;"><option value="deepseek">DeepSeek</option><option value="gemini">Gemini</option><option value="grok">Grok</option></select>
        <input type="text" id="chatPrompt" placeholder="Ketik pesan..." style="flex:1;">
        <input type="file" id="chatFile" style="display:none;">
        <button class="btn btn-outline" onclick="document.getElementById('chatFile').click()">📎</button>
        <button class="btn btn-primary" onclick="sendChat()">${t('send')}</button>
      </div>
    </div>
  `;
}

async function sendChat() {
  const model = document.getElementById('chatModel').value;
  const prompt = document.getElementById('chatPrompt').value;
  const fileInput = document.getElementById('chatFile');
  let input = { prompt };
  if (fileInput.files.length > 0) {
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    const uploadRes = await fetch('/api/v1/upload/file', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData
    }).then(r => r.json());
    if (uploadRes.success) input.file_url = uploadRes.data.url;
  }
  document.getElementById('chatPrompt').value = '';
  const msgs = document.getElementById('chatMessages');
  msgs.innerHTML += `<div class="chat-bubble user">${prompt}</div>`;
  const res = await apiRequest('/api/v1/jobs/createTask', {
    method: 'POST',
    body: JSON.stringify({ provider: model, model: 'chat', input, usePersonalKey: false })
  });
  if (res.success) {
    const pollRes = await apiRequest(`/api/v1/jobs/recordInfo?taskId=${res.data.taskId}`);
    if (pollRes.data.result?.text) {
      msgs.innerHTML += `<div class="chat-bubble ai">${pollRes.data.result.text}</div>`;
      msgs.scrollTop = msgs.scrollHeight;
    }
  }
}

function renderDashboard(container) {
  if (!isLoggedIn()) { window.location.hash = '#/login'; return; }
  apiRequest('/api/v1/user/credits').then(d => {
    const user = d.data;
    container.innerHTML = `
      <div class="container">
        <h2>${t('dashboard')}</h2>
        <div class="grid grid-3">
          <div class="card">
            <h3>Status</h3>
            <p>${user.unlimited ? '<span class="badge badge-success">Unlimited</span>' : '<span class="badge badge-danger">Terbatas</span>'}</p>
            <p>Berakhir: ${user.subscription_end ? new Date(user.subscription_end).toLocaleDateString() : '-'}</p>
            ${!user.unlimited ? '<a href="#/pembayaran" class="btn btn-primary mt-1">Upgrade</a>' : ''}
          </div>
          <div class="card">
            <h3>${t('referral')}</h3>
            <p>Kode: ${user.referral_code || '-'}</p>
            <a href="#/referral" class="btn btn-outline">Detail</a>
          </div>
          <div class="card">
            <h3>API Keys Pribadi</h3>
            <div id="apiKeyListContainer">...</div>
            <button class="btn btn-primary mt-1" onclick="showAddApiKey()">${t('getApiKey')}</button>
          </div>
        </div>
      </div>
    `;
    loadApiKeys();
  });
}

async function loadApiKeys() {
  const res = await apiRequest('/api/v1/user/api-keys');
  const container = document.getElementById('apiKeyListContainer');
  if (!container) return;
  if (res.data.length === 0) {
    container.innerHTML = '<p>Belum ada API key.</p>';
    return;
  }
  container.innerHTML = res.data.map(k => `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
      <span>${k.provider} <span class="badge ${k.is_active ? 'badge-success' : 'badge-danger'}">${k.is_active ? t('statusActive') : t('statusInactive')}</span></span>
      <button class="btn btn-danger" onclick="deleteApiKey(${k.id})" style="padding:0.2rem 0.5rem; font-size:0.8rem;">${t('delete')}</button>
    </div>
  `).join('');
}

async function deleteApiKey(id) {
  await apiRequest(`/api/v1/user/api-key/${id}`, { method: 'DELETE' });
  loadApiKeys();
}

function showAddApiKey() {
  const provider = prompt('Provider (kie-ai, deepseek, dll):');
  const key = prompt('API Key:');
  if (provider && key) {
    apiRequest('/api/v1/user/api-key', {
      method: 'POST',
      body: JSON.stringify({ provider, key })
    }).then(() => loadApiKeys());
  }
}

function renderPembayaran(container) {
  container.innerHTML = `
    <div class="container" style="max-width:500px; margin:2rem auto; text-align:center;">
      <h2>Langganan Premium</h2>
      <p>Rp 700.000 / 3 bulan Unlimited</p>
      <img id="qrImage" src="/images/qr-payment.png" style="width:200px; margin:1rem 0;" onerror="this.src='/images/placeholder-qr.png'">
      <p>Scan QR atau konfirmasi via WhatsApp:</p>
      <a id="waConfirmBtn" class="btn btn-primary" href="#" target="_blank">Konfirmasi ke WhatsApp</a>
    </div>
  `;
  fetch('/api/v1/admin/settings')
    .then(r => r.json())
    .then(d => {
      if (d.data?.payment_qr_url) document.getElementById('qrImage').src = d.data.payment_qr_url;
      const waNum = d.data?.whatsapp_number || '+6285119821813';
      const msg = encodeURIComponent('Halo, saya ingin mengkonfirmasi pembayaran langganan Premium 3 bulan Kreaverse AI.');
      document.getElementById('waConfirmBtn').href = `https://wa.me/${waNum.replace(/\D/g,'')}?text=${msg}`;
    });
}

function renderReferral(container) {
  if (!isLoggedIn()) { window.location.hash = '#/login'; return; }
  apiRequest('/api/v1/user/referral').then(d => {
    container.innerHTML = `
      <div class="container" style="max-width:500px; margin:2rem auto; text-align:center;">
        <h2>${t('referral')}</h2>
        <p>${t('referralDesc')}</p>
        <div style="font-size:2rem; letter-spacing:0.5rem; background:var(--surface); padding:1rem; border-radius:0.5rem; margin:1rem 0;">${d.data.referral_code || 'N/A'}</div>
        <p><a href="#/register">Daftarkan teman</a></p>
      </div>
    `;
  });
}

function renderEnterReferral(container) {
  container.innerHTML = `
    <div class="container" style="max-width:400px; margin:2rem auto;">
      <h2>${t('enterReferral')}</h2>
      <div class="form-group"><input id="enterRefCode" placeholder="Kode"></div>
      <button class="btn btn-primary" onclick="submitReferralCode()">${t('save')}</button>
    </div>
  `;
}

function submitReferralCode() {
  alert('Fitur ini tersedia saat registrasi.');
}

function renderAbout(container) {
  container.innerHTML = `<div class="container"><h2>${t('about')}</h2><p>Kreaverse AI - platform agregasi 11 provider AI oleh HABI STUDIO.</p></div>`;
}

function renderLayanan(container) {
  container.innerHTML = `<div class="container"><h2>${t('services')}</h2><p>Layanan generasi konten AI.</p></div>`;
}

function renderLogin(container) {
  container.innerHTML = `
    <div class="container" style="max-width:400px; margin:2rem auto;">
      <h2>${t('login')}</h2>
      <div class="form-group"><input id="email" type="email" placeholder="Email"></div>
      <div class="form-group"><input id="password" type="password" placeholder="Password"></div>
      <button class="btn btn-primary" onclick="doLogin()">${t('login')}</button>
      <p class="mt-2">Belum punya akun? <a href="#/register">Daftar</a></p>
    </div>
  `;
}

async function doLogin() {
  try {
    await loginUser(document.getElementById('email').value, document.getElementById('password').value);
    window.location.hash = '#/dashboard';
  } catch (e) { alert(e.message); }
}

function renderRegister(container) {
  container.innerHTML = `
    <div class="container" style="max-width:400px; margin:2rem auto;">
      <h2>Daftar</h2>
      <div class="form-group"><input id="regEmail" type="email" placeholder="Email"></div>
      <div class="form-group"><input id="regPassword" type="password" placeholder="Password"></div>
      <div class="form-group"><input id="refCode" placeholder="Kode Undangan (opsional)"></div>
      <button class="btn btn-primary" onclick="doRegister()">Daftar</button>
    </div>
  `;
}

async function doRegister() {
  try {
    await apiRequest('/api/v1/user/register', {
      method: 'POST',
      body: JSON.stringify({
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
        referral_code: document.getElementById('refCode').value
      })
    });
    alert('Registrasi berhasil, silakan login.');
    window.location.hash = '#/login';
  } catch (e) { alert(e.message); }
}

function renderDokumentasi(container) {
  container.innerHTML = `
    <div class="container">
      <h2>Dokumentasi API</h2>
      <pre style="background:var(--surface); padding:1rem; border-radius:0.5rem; overflow-x:auto;">
POST /api/v1/jobs/createTask
GET /api/v1/jobs/recordInfo?taskId=
GET /api/v1/common/download-url?url=
      </pre>
    </div>
  `;
}
