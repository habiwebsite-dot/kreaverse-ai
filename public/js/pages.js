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
  container.innerHTML = '<section class="hero">' +
    '<h1 style="background: linear-gradient(135deg, #3182CE, #D53F8C); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">' + t("heroTitle") + '</h1>' +
    '<p>' + t("heroSub") + '</p>' +
    '<div style="margin-top:2rem;">' +
    '<a href="#/playground" class="btn btn-primary">🚀 ' + t("tryNow") + '</a>' +
    '<a href="#/layanan" class="btn btn-outline" style="margin-left:1rem;">📋 ' + t("viewServices") + '</a>' +
    '</div></section>' +
    '<div class="container grid grid-4 mt-3">' +
    '<a href="#/playground?provider=kie-ai" class="card text-center" style="text-decoration:none; color:inherit;"><div style="font-size:2.5rem;">🖼️</div><h3>' + t("categoryImage") + '</h3><p>Seedream, Flux, Leonardo</p></a>' +
    '<a href="#/playground?provider=evolink" class="card text-center" style="text-decoration:none; color:inherit;"><div style="font-size:2.5rem;">🎥</div><h3>' + t("categoryVideo") + '</h3><p>Kling, Evolink</p></a>' +
    '<a href="#/playground?provider=sunoapi" class="card text-center" style="text-decoration:none; color:inherit;"><div style="font-size:2.5rem;">🎵</div><h3>' + t("categoryAudio") + '</h3><p>SunoAPI, AI Mastering</p></a>' +
    '<a href="#/playground?provider=deepseek" class="card text-center" style="text-decoration:none; color:inherit;"><div style="font-size:2.5rem;">💬</div><h3>' + t("categoryChat") + '</h3><p>DeepSeek, Gemini, Grok</p></a>' +
    '</div>' +
    '<a href="#/playground?provider=sunoapi" style="text-decoration:none;"><div class="container" style="background:linear-gradient(135deg,#3182CE,#D53F8C); padding:2rem; text-align:center; margin:2rem auto; border-radius:1rem; color:#fff; font-size:1.2rem; font-weight:600;">' + t("audioBanner") + '</div></a>' +
    '<div class="container grid grid-2">' +
    '<div class="card text-center"><h3>💎 Langganan Premium</h3><p style="font-size:1.5rem; font-weight:700;">Rp 700.000</p><p>3 bulan unlimited tanpa batas</p><a href="#/pembayaran" class="btn btn-primary mt-2">Langganan Sekarang</a></div>' +
    '<div class="card text-center"><h3>🔑 API Key Pribadi</h3><p>Gunakan API key sendiri, multi-key support</p><a href="#/dashboard" class="btn btn-outline mt-2">Kelola API Key</a></div>' +
    '</div>';
}

function renderTools(container) {
  var cards = "";
  for (var key in PROVIDER_DATA) {
    var prov = PROVIDER_DATA[key];
    cards += '<div class="card text-center"><h4>' + prov.name + '</h4><p>' + prov.description + '</p><p><small>' + prov.models.join(", ") + '</small></p><a href="#/playground?provider=' + key + '" class="btn btn-sm btn-outline mt-1">Coba</a></div>';
  }
  container.innerHTML = '<div class="container"><h2>' + t("tools") + '</h2><div class="grid grid-3">' + cards + '</div></div>';
}

function renderPlayground(container) {
  if (!isLoggedIn()) { window.location.hash = '#/login'; return; }
  var hash = window.location.hash;
  var params = {};
  if (hash.indexOf("?") > -1) {
    var query = hash.split("?")[1];
    query.split("&").forEach(function(p) {
      var pair = p.split("=");
      params[pair[0]] = pair[1] || "";
    });
  }
  var defaultProvider = params.provider || "kie-ai";
  var providerOptions = "";
  for (var key in PROVIDER_DATA) {
    providerOptions += '<option value="' + key + '"' + (key === defaultProvider ? ' selected' : '') + '>' + PROVIDER_DATA[key].name + '</option>';
  }
  container.innerHTML = '<div class="container"><h2>🎮 ' + t("playground") + '</h2>' +
    '<div class="grid grid-2">' +
    '<div class="card">' +
    '<div class="form-group"><label>' + t("selectProvider") + '</label><select id="providerSelect" onchange="onProviderChange()">' + providerOptions + '</select></div>' +
    '<div class="form-group"><label>' + t("selectModel") + '</label><select id="modelSelect" onchange="onModelChange()"></select></div>' +
    '<div id="modelDescription" class="text-secondary mb-2" style="font-size:0.85rem;"></div>' +
    '<div class="form-group"><label>' + t("inputPrompt") + '</label><textarea id="promptInput" rows="4" placeholder="Masukkan prompt detail..."></textarea></div>' +
    '<div id="advancedParams"></div>' +
    '<div class="form-group" id="fileUploadArea" style="display:none;"><label>' + t("uploadFile") + '</label><input type="file" id="fileInput" multiple accept="image/*,audio/*,video/*"></div>' +
    '<div class="form-group"><label>API Key Mode</label><select id="apiKeyMode"><option value="server">🌐 Server (Admin)</option><option value="personal">🔒 Pribadi</option></select></div>' +
    '<button class="btn btn-primary btn-lg" onclick="generate()" style="width:100%;">⚡ ' + t("generate") + '</button>' +
    '<div id="generationStatus" class="mt-2 text-center"></div>' +
    '</div>' +
    '<div class="card"><h3>📤 ' + t("result") + '</h3><div id="resultContainer" class="text-center text-secondary">' + t("noResults") + '</div><div id="downloadArea" class="mt-2 text-center"></div></div>' +
    '</div></div>';
  onProviderChange();
}

function onProviderChange() {
  var provider = document.getElementById("providerSelect").value;
  var provData = PROVIDER_DATA[provider];
  var modelSelect = document.getElementById("modelSelect");
  modelSelect.innerHTML = "";
  provData.models.forEach(function(m) {
    modelSelect.innerHTML += '<option value="' + m + '">' + m.charAt(0).toUpperCase() + m.slice(1) + '</option>';
  });
  document.getElementById("modelDescription").innerText = provData.description;
  onModelChange();
}

function onModelChange() {
  var provider = document.getElementById("providerSelect").value;
  var model = document.getElementById("modelSelect").value;
  var type = PROVIDER_DATA[provider].types[model];
  var advanced = document.getElementById("advancedParams");
  var fileUpload = document.getElementById("fileUploadArea");
  advanced.innerHTML = "";
  fileUpload.style.display = "none";
  if (type === "image") {
    fileUpload.style.display = "block";
    advanced.innerHTML = '<div class="form-group"><label>' + t("aspectRatio") + '</label><select id="aspectRatio"><option>1:1</option><option>16:9</option><option>9:16</option></select></div>' +
      '<div class="form-group"><label>' + t("resolution") + '</label><select id="resolution"><option>1024x1024</option><option>1792x1024</option><option>1024x1792</option></select></div>';
  } else if (type === "video") {
    fileUpload.style.display = "block";
    advanced.innerHTML = '<div class="form-group"><label>' + t("duration") + ' (detik)</label><input id="duration" type="number" value="5" min="1" max="30"></div>' +
      '<div class="form-group"><label>' + t("resolution") + '</label><select id="resolution"><option>720p</option><option>1080p</option></select></div>';
  } else if (type === "audio") {
    fileUpload.style.display = "block";
    if (model === "mastering") {
      advanced.innerHTML = '<div class="form-group"><label>Target Loudness (LUFS)</label><input id="targetLoudness" value="-14"></div>' +
        '<div class="form-group"><label>Ceiling (dB)</label><input id="ceiling" value="-1"></div>' +
        '<div class="form-group"><label>Output Format</label><select id="outputFormat"><option value="wav">WAV</option><option value="mp3">MP3</option></select></div>';
    } else {
      advanced.innerHTML = '<div class="form-group"><label>' + t("title") + '</label><input id="title"></div>' +
        '<div class="form-group"><label>' + t("style") + '</label><input id="style"></div>' +
        '<div class="form-group"><label>' + t("lyrics") + '</label><textarea id="lyrics" rows="2"></textarea></div>';
    }
  }
}

async function generate() {
  var provider = document.getElementById("providerSelect").value;
  var model = document.getElementById("modelSelect").value;
  var prompt = document.getElementById("promptInput").value;
  var input = { prompt: prompt };
  var type = PROVIDER_DATA[provider].types[model];
  if (type === "image") { input.aspect_ratio = document.getElementById("aspectRatio") ? document.getElementById("aspectRatio").value : ""; input.resolution = document.getElementById("resolution") ? document.getElementById("resolution").value : ""; }
  if (type === "video") { input.duration = document.getElementById("duration") ? document.getElementById("duration").value : ""; input.resolution = document.getElementById("resolution") ? document.getElementById("resolution").value : ""; }
  if (type === "audio" && model === "mastering") { input.target_loudness = document.getElementById("targetLoudness") ? document.getElementById("targetLoudness").value : ""; input.ceiling = document.getElementById("ceiling") ? document.getElementById("ceiling").value : ""; input.output_format = document.getElementById("outputFormat") ? document.getElementById("outputFormat").value : ""; }
  if (type === "audio" && model === "music") { input.title = document.getElementById("title") ? document.getElementById("title").value : ""; input.style = document.getElementById("style") ? document.getElementById("style").value : ""; input.lyrics = document.getElementById("lyrics") ? document.getElementById("lyrics").value : ""; }
  var usePersonal = document.getElementById("apiKeyMode") ? document.getElementById("apiKeyMode").value === "personal" : false;
  var fileInput = document.getElementById("fileInput");
  if (fileInput && fileInput.files.length > 0) {
    var formData = new FormData();
    formData.append("file", fileInput.files[0]);
    var uploadRes = await fetch("/api/v1/upload/file", {
      method: "POST",
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      body: formData
    }).then(function(r) { return r.json(); });
    if (uploadRes.success) input.file_url = uploadRes.data.url;
  }
  document.getElementById("generationStatus").innerHTML = '<span class="badge badge-warning">⏳ Processing...</span>';
  document.getElementById("resultContainer").innerHTML = '<div class="spinner"></div>';
  try {
    var res = await apiRequest("/api/v1/jobs/createTask", {
      method: "POST",
      body: JSON.stringify({ provider: provider, model: model, input: input, usePersonalKey: usePersonal })
    });
    pollTask(res.data.taskId);
  } catch (e) {
    document.getElementById("generationStatus").innerHTML = '<span class="badge badge-danger">❌ ' + e.message + '</span>';
  }
}

async function pollTask(taskId) {
  var res = await apiRequest("/api/v1/jobs/recordInfo?taskId=" + taskId);
  if (res.data.state === 2) {
    document.getElementById("generationStatus").innerHTML = '<span class="badge badge-success">✅ Completed</span>';
    displayResults(res.data.resultUrls, res.data.result);
  } else if (res.data.state === 3) {
    document.getElementById("generationStatus").innerHTML = '<span class="badge badge-danger">❌ Failed</span>';
  } else {
    setTimeout(function() { pollTask(taskId); }, 3000);
  }
}

function displayResults(urls, result) {
  var container = document.getElementById("resultContainer");
  var downloadArea = document.getElementById("downloadArea");
  if (urls && urls.length) {
    container.innerHTML = "";
    urls.forEach(function(u) {
      if (u.match(/\.(mp4|webm|mov)/i)) {
        container.innerHTML += '<video controls style="width:100%;border-radius:0.5rem;"><source src="' + u + '"></video>';
      } else if (u.match(/\.(mp3|wav|ogg)/i)) {
        container.innerHTML += '<audio controls src="' + u + '" style="width:100%;"></audio>';
      } else {
        container.innerHTML += '<img src="' + u + '" style="width:100%;border-radius:0.5rem;margin-bottom:0.5rem;">';
      }
    });
    downloadArea.innerHTML = "";
    urls.forEach(function(u) {
      downloadArea.innerHTML += '<a href="/api/v1/common/download-url?url=' + encodeURIComponent(u) + '" class="btn btn-sm btn-outline">⬇ Download</a> ';
    });
  } else if (result && result.text) {
    container.innerHTML = '<div style="white-space:pre-wrap;background:var(--bg);padding:1rem;border-radius:0.5rem;">' + result.text + '</div>';
  }
}

function renderChat(container) {
  if (!isLoggedIn()) { window.location.hash = '#/login'; return; }
  container.innerHTML = '<div class="container chat-container"><h2>💬 ' + t("chat") + '</h2>' +
    '<div class="card chat-messages" id="chatMessages"><div class="text-center text-secondary">Kirim pesan untuk memulai percakapan dengan AI</div></div>' +
    '<div class="card" style="display:flex; gap:0.5rem; margin-top:0.5rem;">' +
    '<select id="chatModel" style="width:auto;"><option value="deepseek">DeepSeek</option><option value="gemini">Gemini</option><option value="grok">Grok</option></select>' +
    '<input type="text" id="chatPrompt" placeholder="Ketik pesan..." style="flex:1;" onkeypress="if(event.key===\'Enter\') sendChat()">' +
    '<input type="file" id="chatFile" style="display:none;" accept="image/*">' +
    '<button class="btn btn-outline" onclick="document.getElementById(\'chatFile\').click()">📎</button>' +
    '<button class="btn btn-primary" onclick="sendChat()">➤</button>' +
    '</div></div>';
}

async function sendChat() {
  var model = document.getElementById("chatModel").value;
  var prompt = document.getElementById("chatPrompt").value;
  if (!prompt.trim()) return;
  var fileInput = document.getElementById("chatFile");
  var input = { prompt: prompt };
  var msgs = document.getElementById("chatMessages");
  msgs.innerHTML += '<div class="chat-bubble user">' + prompt + '</div>';
  document.getElementById("chatPrompt").value = "";
  if (fileInput.files.length > 0) {
    var formData = new FormData();
    formData.append("file", fileInput.files[0]);
    var uploadRes = await fetch("/api/v1/upload/file", {
      method: "POST",
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      body: formData
    }).then(function(r) { return r.json(); });
    if (uploadRes.success) input.file_url = uploadRes.data.url;
    fileInput.value = "";
  }
  try {
    var res = await apiRequest("/api/v1/jobs/createTask", {
      method: "POST",
      body: JSON.stringify({ provider: model, model: "chat", input: input, usePersonalKey: false })
    });
    var pollRes = await apiRequest("/api/v1/jobs/recordInfo?taskId=" + res.data.taskId);
    if (pollRes.data.result && pollRes.data.result.text) {
      msgs.innerHTML += '<div class="chat-bubble ai">' + pollRes.data.result.text + '</div>';
    }
    msgs.scrollTop = msgs.scrollHeight;
  } catch (e) {
    msgs.innerHTML += '<div class="chat-bubble ai">❌ Error: ' + e.message + '</div>';
  }
}

function renderDashboard(container) {
  if (!isLoggedIn()) { window.location.hash = '#/login'; return; }
  apiRequest("/api/v1/user/credits").then(function(d) {
    var user = d.data;
    container.innerHTML = '<div class="container"><h2>📊 ' + t("dashboard") + '</h2>' +
      '<div class="grid grid-3">' +
      '<div class="card"><h3>Status Langganan</h3><p>' + (user.unlimited ? '<span class="badge badge-success">✨ Unlimited</span>' : '<span class="badge badge-danger">Terbatas</span>') + '</p><p>Berakhir: ' + (user.subscription_end ? new Date(user.subscription_end).toLocaleDateString() : "-") + '</p>' + (!user.unlimited ? '<a href="#/pembayaran" class="btn btn-primary mt-1">Upgrade</a>' : "") + '</div>' +
      '<div class="card"><h3>' + t("referral") + '</h3><p>Kode: <strong>' + (user.referral_code || "-") + '</strong></p><a href="#/referral" class="btn btn-outline btn-sm">Detail</a></div>' +
      '<div class="card"><h3>API Keys Pribadi</h3><div id="apiKeyListContainer">Loading...</div><button class="btn btn-primary btn-sm mt-1" onclick="showAddApiKey()">+ Tambah</button></div>' +
      '</div></div>';
    loadApiKeys();
  });
}

async function loadApiKeys() {
  var res = await apiRequest("/api/v1/user/api-keys");
  var container = document.getElementById("apiKeyListContainer");
  if (!container) return;
  if (res.data.length === 0) { container.innerHTML = '<p class="text-secondary">Belum ada API key.</p>'; return; }
  container.innerHTML = "";
  res.data.forEach(function(k) {
    container.innerHTML += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;"><span>' + k.provider + ' <span class="badge ' + (k.is_active ? "badge-success" : "badge-danger") + '">' + (k.is_active ? t("statusActive") : t("statusInactive")) + '</span></span><button class="btn btn-danger btn-sm" onclick="deleteApiKey(' + k.id + ')">X</button></div>';
  });
}

async function deleteApiKey(id) {
  await apiRequest("/api/v1/user/api-key/" + id, { method: "DELETE" });
  loadApiKeys();
}

function showAddApiKey() {
  var provider = prompt("Provider (kie-ai, deepseek, dll):");
  var key = prompt("API Key:");
  if (provider && key) {
    apiRequest("/api/v1/user/api-key", { method: "POST", body: JSON.stringify({ provider: provider, key: key }) }).then(function() { loadApiKeys(); });
  }
}

function renderPembayaran(container) {
  container.innerHTML = '<div class="container" style="max-width:600px; margin:2rem auto; text-align:center;"><h2>💎 Langganan Premium</h2>' +
    '<div class="card"><h3 style="font-size:2rem;">Rp 700.000</h3><p>3 bulan akses unlimited</p>' +
    '<img id="qrImage" src="/images/qr-payment.png" style="width:200px; margin:1rem 0;" onerror="this.style.display=\'none\'">' +
    '<div id="bankInfo" class="mt-2"></div>' +
    '<a id="waConfirmBtn" class="btn btn-primary mt-2" href="#" target="_blank">Konfirmasi via WhatsApp</a>' +
    '</div></div>';
  fetch("/api/v1/admin/settings").then(function(r) { return r.json(); }).then(function(d) {
    if (d.data && d.data.payment_qr_url) document.getElementById("qrImage").src = d.data.payment_qr_url;
    if (d.data && d.data.bank_transfer) {
      document.getElementById("bankInfo").innerHTML = '<p><strong>Transfer Bank ' + d.data.bank_transfer.bank_name + '</strong><br>No: ' + d.data.bank_transfer.account_number + '<br>a.n: ' + d.data.bank_transfer.account_holder + '</p>';
    }
    var waNum = (d.data && d.data.whatsapp_number) ? d.data.whatsapp_number : "+6285119821813";
    document.getElementById("waConfirmBtn").href = "https://wa.me/" + waNum.replace(/\D/g, "") + "?text=" + encodeURIComponent("Halo admin, saya ingin konfirmasi pembayaran Premium Kreaverse AI.");
  });
}

function renderLogin(container) {
  container.innerHTML = '<div class="container" style="max-width:420px; margin:2rem auto;"><h2>🔐 ' + t("login") + '</h2><div class="card"><div class="form-group"><input id="email" type="email" placeholder="Email"></div><div class="form-group"><input id="password" type="password" placeholder="Password"></div><button class="btn btn-primary" onclick="doLogin()" style="width:100%;">' + t("login") + '</button><p class="mt-2 text-center">Belum punya akun? <a href="#/register">Daftar</a></p></div></div>';
}

async function doLogin() {
  try {
    await loginUser(document.getElementById("email").value, document.getElementById("password").value);
    window.location.hash = "#/dashboard";
  } catch (e) { alert(e.message); }
}

function renderRegister(container) {
  container.innerHTML = '<div class="container" style="max-width:420px; margin:2rem auto;"><h2>📝 Daftar</h2><div class="card"><div class="form-group"><input id="regEmail" type="email" placeholder="Email"></div><div class="form-group"><input id="regPassword" type="password" placeholder="Password"></div><div class="form-group"><input id="refCode" placeholder="Kode Undangan (opsional)"></div><button class="btn btn-primary" onclick="doRegister()" style="width:100%;">Daftar</button><p class="mt-2 text-center">Sudah punya akun? <a href="#/login">Login</a></p></div></div>';
}

async function doRegister() {
  try {
    await apiRequest("/api/v1/user/register", {
      method: "POST",
      body: JSON.stringify({
        email: document.getElementById("regEmail").value,
        password: document.getElementById("regPassword").value,
        referral_code: document.getElementById("refCode").value
      })
    });
    alert("Registrasi berhasil! Silakan login.");
    window.location.hash = "#/login";
  } catch (e) { alert(e.message); }
}

function renderReferral(container) {
  if (!isLoggedIn()) { window.location.hash = "#/login"; return; }
  apiRequest("/api/v1/user/referral").then(function(d) {
    container.innerHTML = '<div class="container text-center" style="max-width:500px; margin:2rem auto;"><h2>🔗 ' + t("referral") + '</h2><p>' + t("referralDesc") + '</p><div style="font-size:2rem; letter-spacing:0.5rem; background:var(--surface); padding:1rem; border-radius:0.5rem; margin:1rem 0;">' + (d.data.referral_code || "N/A") + '</div></div>';
  });
}

function renderAbout(container) {
  container.innerHTML = '<div class="container"><h2>' + t("about") + '</h2><p>Kreaverse AI adalah platform agregasi 11 provider AI terbaik di Indonesia, dikembangkan oleh HABI STUDIO untuk memudahkan akses ke berbagai model AI generatif.</p></div>';
}

function renderLayanan(container) {
  container.innerHTML = '<div class="container"><h2>' + t("services") + '</h2><p>Kami menyediakan layanan generasi gambar, video, audio, mastering, dan chat AI dengan dukungan multi-provider.</p></div>';
}

function renderDokumentasi(container) {
  container.innerHTML = '<div class="container"><h2>Dokumentasi API</h2><pre>POST /api/v1/jobs/createTask\nGET /api/v1/jobs/recordInfo?taskId=</pre></div>';
}

function renderEnterReferral(container) {
  container.innerHTML = '<div class="container" style="max-width:400px;"><h2>' + t("enterReferral") + '</h2><input id="enterRefCode" placeholder="Kode"><button onclick="submitReferralCode()">' + t("save") + '</button></div>';
}

function submitReferralCode() {
  alert("Fitur tersedia saat registrasi.");
}
