/* kreaverse-ai — frontend logic / By HABI-STUDIO.AI */
const API = '/api/v1';
const STATE = {
  token: localStorage.getItem('kv_token') || '',
  user: JSON.parse(localStorage.getItem('kv_user') || 'null'),
  apiUnlimited: localStorage.getItem('kv_api_mode') !== 'off',
  info: null,
};

// === Watermark on first tool open ===
let watermarkShown = false;
function showWatermark(){
  if (watermarkShown) return;
  watermarkShown = true;
  const wm = document.getElementById('watermark');
  wm.classList.remove('hidden');
  setTimeout(()=>{ wm.classList.add('fadeout'); setTimeout(()=>wm.classList.add('hidden'), 800); }, 3000);
}

// === Reveal on scroll ===
const io = new IntersectionObserver((ents)=>ents.forEach(e=>e.isIntersecting&&e.target.classList.add('in')),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// === Lang ===
const lang = localStorage.getItem('kv_lang') || 'id';
document.getElementById('lang').value = lang;
applyI18n(lang);
document.getElementById('lang').addEventListener('change', e => applyI18n(e.target.value));

// === Burger menu ===
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
burger.addEventListener('click', () => drawer.classList.toggle('open'));
drawer.addEventListener('click', e => { if (e.target.tagName === 'A') drawer.classList.remove('open'); });
document.addEventListener('click', e => {
  if (!drawer.contains(e.target) && e.target !== burger) drawer.classList.remove('open');
});

// === API toggle ===
const apiBtn = document.getElementById('apiToggle');
function renderApiBtn(){
  apiBtn.querySelector('.dot').className = 'dot ' + (STATE.apiUnlimited ? 'on':'off');
  document.getElementById('apiMode').textContent = STATE.apiUnlimited ? 'Unlimited' : 'Key Sendiri';
}
renderApiBtn();
apiBtn.addEventListener('click', ()=>{
  STATE.apiUnlimited = !STATE.apiUnlimited;
  localStorage.setItem('kv_api_mode', STATE.apiUnlimited ? 'on' : 'off');
  renderApiBtn();
  if (!STATE.apiUnlimited) {
    if (!STATE.token) { openLogin(); return; }
    openKeysManager();
  }
});

// === Auth slot (Login vs Avatar) ===
function renderAuthSlot(){
  const slot = document.getElementById('authSlot');
  if (STATE.token && STATE.user){
    const initial = (STATE.user.email || '?')[0].toUpperCase();
    slot.innerHTML = `
      <div class="avatar" id="avatarBtn" title="${STATE.user.email}">${initial}
        <div class="avatar-menu hidden" id="avatarMenu">
          <div class="me">${STATE.user.email}<br/><small style="color:#22c55e">● ${STATE.user.plan}</small></div>
          <button id="amKeys">🔑 API Key Saya</button>
          <button id="amInvite">🎁 Undang Teman</button>
          <button id="amLogout">🚪 Logout</button>
        </div>
      </div>`;
    const btn = document.getElementById('avatarBtn');
    const menu = document.getElementById('avatarMenu');
    btn.addEventListener('click', e => { e.stopPropagation(); menu.classList.toggle('hidden'); });
    document.addEventListener('click', e => { if (!btn.contains(e.target)) menu.classList.add('hidden'); });
    document.getElementById('amKeys').onclick = ()=>{ menu.classList.add('hidden'); openKeysManager(); };
    document.getElementById('amInvite').onclick = ()=>{ menu.classList.add('hidden'); location.hash='#undang'; };
    document.getElementById('amLogout').onclick = ()=>{
      localStorage.removeItem('kv_token'); localStorage.removeItem('kv_user');
      STATE.token=''; STATE.user=null; renderAuthSlot();
    };
  } else {
    slot.innerHTML = `<button id="btnLogin" class="btn primary sm">Login</button>`;
    document.getElementById('btnLogin').addEventListener('click', openLogin);
  }
}
renderAuthSlot();

// === Login ===
function openLogin(){
  openModal(`
    <h2>🔐 Login kreaverse-ai</h2>
    <p class="muted">Akun default: <code>habistudio.ai@unlimited.com</code> / <code>habi.studio.com</code></p>
    <label>Email</label><input id="lgEmail" type="email" value="habistudio.ai@unlimited.com" autocomplete="email"/>
    <label>Password</label><input id="lgPass" type="password" value="habi.studio.com" autocomplete="current-password"/>
    <div class="row" style="margin-top:14px"><button id="lgSubmit" class="btn primary">Login</button>
    <a class="btn ghost" href="#harga" data-close>Beli Premium →</a></div>
    <p class="small muted" style="margin-top:10px">Belum punya akun? <a href="#harga" data-close>Lihat paket premium</a></p>
  `);
  document.getElementById('lgSubmit').onclick = doLogin;
  document.getElementById('lgPass').addEventListener('keydown', e => { if (e.key==='Enter') doLogin(); });
}
async function doLogin(){
  const email = document.getElementById('lgEmail').value.trim();
  const password = document.getElementById('lgPass').value;
  try {
    const r = await fetch(API+'/user/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})}).then(r=>r.json());
    if (!r.ok) return alert(r.error || 'Login gagal');
    STATE.token = r.token; STATE.user = r.user;
    localStorage.setItem('kv_token', r.token);
    localStorage.setItem('kv_user', JSON.stringify(r.user));
    closeModal(); renderAuthSlot();
  } catch (e) { alert('Network error: '+e.message); }
}

// === Modal helpers ===
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
function openModal(html){ modalBody.innerHTML = html; modal.classList.remove('hidden'); showWatermark(); }
function closeModal(){ modal.classList.add('hidden'); }
modal.addEventListener('click', e=>{
  if (e.target.dataset?.close !== undefined || e.target === modal) closeModal();
});

// === Auth guard ===
function needLogin(){
  if (!STATE.token) { openLogin(); return true; }
  return false;
}

// === Helper: header with auth + user-key mode ===
function authHdr(json){
  const h = {};
  if (json) h['Content-Type'] = 'application/json';
  if (STATE.token) h.Authorization = 'Bearer ' + STATE.token;
  // Beritahu backend: user pakai key sendiri (OFF) atau unlimited (ON)
  h['X-KV-Key-Mode'] = STATE.apiUnlimited ? 'unlimited' : 'user';
  return h;
}

// === Load /info & render providers + bind tools ===
fetch(API+'/info').then(r=>r.json()).then(d=>{
  STATE.info = d;
  renderProviders(d);
});

const PROVIDER_META = {
  kie:{ logo:'/images/providers/kie.png',          emoji:'🌀' },
  apibox:{ logo:'/images/providers/apibox.png',    emoji:'📦' },
  apiframe:{ logo:'/images/providers/apiframe.png',emoji:'🖼️' },
  crun:{ logo:'/images/providers/crun.png',        emoji:'⚡' },
  suno:{ logo:'/images/providers/suno.png',        emoji:'🎵' },
  evolink:{ logo:'/images/providers/evolink.png',  emoji:'🔗' },
  aimastering:{ logo:'/images/providers/aimastering.png', emoji:'🎛️' },
  deepseek:{ logo:'/images/providers/deepseek.png',emoji:'🐋' },
  leonardo:{ logo:'/images/providers/leonardo.png',emoji:'🦁' },
  gemini:{ logo:'/images/providers/gemini.png',    emoji:'💎' },
  grok:{ logo:'/images/providers/grok.png',        emoji:'🛸' },
};

function renderProviders(info){
  const wrap = document.getElementById('providerList');
  const mbp = info.modelsByProvider || {};
  wrap.innerHTML = info.providers.map(p=>{
    const models = mbp[p.id] || [];
    const meta = PROVIDER_META[p.id] || {emoji:'🤖'};
    return `
    <div class="provider-block reveal" id="prov-${p.id}">
      <div class="provider-head">
        <div class="provider-logo">
          <img src="${meta.logo}" alt="${p.name}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${meta.emoji}'}))"/>
        </div>
        <div>
          <div class="provider-name">${p.name}</div>
          <div class="provider-tag">kreaverse-ai</div>
        </div>
        <a class="provider-docs" href="${p.docs}" target="_blank" rel="noopener">📚 Docs →</a>
      </div>
      <div class="model-grid">
        ${models.length ? models.map(m=>`
          <div class="model-chip" data-model="${m.id}" data-kind="${m.kind}">
            <div class="model-thumb">
              <img src="/images/models/${m.id}.png" alt="${m.label}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:kindEmoji('${m.kind}')}))"/>
            </div>
            <div class="model-info">${m.label}<br/><small>${m.kind}</small></div>
          </div>`).join('') : '<p class="muted">Model akan tampil setelah API key terdaftar.</p>'}
      </div>
    </div>`;
  }).join('');
  document.querySelectorAll('.model-chip').forEach(el=>{
    el.addEventListener('click', ()=>openModelTool(el.dataset.model, el.dataset.kind));
  });
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}
function kindEmoji(k){ return ({image:'🖼️',video:'🎥',audio:'🎵',chat:'💬'})[k]||'✨'; }

// === Open generic tool ===
function openModelTool(modelId, kind){
  if (needLogin()) return;
  const presets = {
    image: imageToolHtml(modelId),
    video: videoToolHtml(modelId),
    audio: audioToolHtml(modelId),
    chat:  chatToolHtml(modelId),
  };
  openModal(presets[kind] || presets.image);
  bindToolForm(modelId, kind);
}

// === Tool HTMLs ===
function imageToolHtml(id){
  return `
  <h2>🖼️ Image Generator — ${id}</h2>
  <p class="muted">Upload hingga 5 gambar referensi (opsional) untuk Image-to-Image.</p>
  <label>Prompt</label><textarea id="f_prompt" placeholder="Contoh: studio portrait of a tiger, cinematic lighting"></textarea>
  <label>Referensi @foto1..@foto5 (opsional)</label>
  <input id="f_refs" type="file" accept="image/*" multiple />
  <div class="row">
    <div style="flex:1;min-width:140px"><label>Aspect Ratio</label>
      <select id="f_ar"><option>1:1</option><option>16:9</option><option>9:16</option><option>4:3</option><option>3:4</option></select>
    </div>
    <div style="flex:1;min-width:140px"><label>Resolusi</label>
      <select id="f_res"><option>1024</option><option>1280</option><option>1536</option><option>2048</option></select>
    </div>
  </div>
  <button id="f_go" class="btn primary big" style="margin-top:14px">Generate Sekarang</button>
  <div id="f_result" class="result hidden"></div>`;
}
function videoToolHtml(id){
  return `
  <h2>🎥 Video Generator — ${id}</h2>
  <label>Prompt</label><textarea id="f_prompt" placeholder="Contoh: cinematic drone shot of Jember rice fields at sunrise"></textarea>
  <label>Referensi gambar (max 5)</label><input id="f_refs" type="file" accept="image/*" multiple/>
  <label>Referensi video (opsional)</label><input id="f_refvid" type="file" accept="video/*"/>
  <div class="row">
    <div style="flex:1;min-width:120px"><label>Resolusi</label>
      <select id="f_res"><option>720p</option><option>1080p</option><option>4K</option></select>
    </div>
    <div style="flex:1;min-width:120px"><label>Aspect Ratio</label>
      <select id="f_ar"><option>16:9</option><option>9:16</option><option>1:1</option></select>
    </div>
    <div style="flex:1;min-width:120px"><label>Durasi (detik)</label>
      <input id="f_dur" type="number" min="2" max="20" value="5"/>
    </div>
  </div>
  <button id="f_go" class="btn primary big" style="margin-top:14px">Generate Sekarang</button>
  <div id="f_result" class="result hidden"></div>`;
}
function audioToolHtml(id){
  const isMastering = id === 'aimastering';
  if (isMastering) return masteringHtml();
  return `
  <h2>🎵 Music Cover — ${id}</h2>
  <label>Upload audio referensi (opsional)</label><input id="f_audio" type="file" accept="audio/*"/>
  <div class="row">
    <div style="flex:1;min-width:160px"><label>Judul</label><input id="f_title" type="text" placeholder="Judul lagu"/></div>
    <div style="flex:1;min-width:160px"><label>Style</label><input id="f_style" type="text" placeholder="dangdut koplo, pop, rock"/></div>
  </div>
  <label>Lirik</label><textarea id="f_lyrics" placeholder="Tulis lirik di sini..."></textarea>
  <div class="row">
    <div style="flex:1;min-width:140px"><label>Vocal</label>
      <select id="f_vocal"><option value="male">Pria</option><option value="female">Wanita</option></select>
    </div>
    <div style="flex:2;min-width:160px"><label>Negative tags</label><input id="f_neg" type="text" placeholder="metal, screaming"/></div>
  </div>
  ${slider('Style weight','f_sw',0,1,0.65,0.01)}
  ${slider('Weirdness constraint','f_wc',0,1,0.5,0.01)}
  ${slider('Audio weight','f_aw',0,1,0.65,0.01)}
  <button id="f_go" class="btn primary big" style="margin-top:14px">Generate Sekarang</button>
  <div id="f_result" class="result hidden"></div>`;
}
function masteringHtml(){
  return `
  <h2>🎛️ AI Mastering</h2>
  <div class="tab-bar">
    <button class="active" data-tab="easy">Easy</button>
    <button data-tab="custom">Custom</button>
  </div>
  <label>Upload Audio</label><input id="f_audio" type="file" accept="audio/*" required/>
  <div id="tab-easy">
    <p class="muted">Mode mudah — target loudness fixed -8 LUFS, ceiling -0.1 dBFS.</p>
  </div>
  <div id="tab-custom" style="display:none">
    <div class="row">
      <div style="flex:1;min-width:120px"><label>Limiter</label><select id="m_lim"><option>on</option><option>off</option></select></div>
      <div style="flex:1;min-width:140px"><label>Target Loudness Mode</label><select id="m_tlm"><option>loudness</option><option>rms</option><option>peak</option></select></div>
      <div style="flex:1;min-width:140px"><label>Target Loudness (LUFS)</label><input id="m_tl" type="number" value="-8" step="0.1"/></div>
    </div>
    <div class="row">
      <div style="flex:1;min-width:120px"><label>Ceiling Mode</label><select id="m_cm"><option>peak</option><option>true_peak</option></select></div>
      <div style="flex:1;min-width:120px"><label>Ceiling (dBFS)</label><input id="m_c" type="number" value="-0.1" step="0.01"/></div>
      <div style="flex:1;min-width:120px"><label>Oversampling</label><select id="m_os"><option>1</option><option selected>2</option><option>4</option></select></div>
    </div>
    <div class="row">
      <div style="flex:1;min-width:140px"><label>Automatic Mastering Level</label><input id="m_aml" type="number" min="0" max="1" step="0.05" value="0.5"/></div>
      <div style="flex:1;min-width:160px"><label>Reference Audio (opsional)</label><input id="m_ref" type="file" accept="audio/*"/></div>
    </div>
    <div class="row">
      <div style="flex:1;min-width:120px"><label>Output Format</label><select id="m_of"><option>wav</option><option>mp3</option><option>flac</option></select></div>
      <div style="flex:1;min-width:120px"><label>Sample Rate</label><select id="m_sr"><option>44100</option><option>48000</option><option>96000</option></select></div>
      <div style="flex:1;min-width:120px"><label>Algorithm</label><select id="m_alg"><option>v2</option><option>v3</option></select></div>
    </div>
    <div class="row">
      <div style="flex:1;min-width:120px"><label>Low Cut Freq (Hz)</label><input id="m_lc" type="number" value="20"/></div>
      <div style="flex:1;min-width:120px"><label>High Cut Freq (Hz)</label><input id="m_hc" type="number" value="20000"/></div>
      <div style="flex:1;min-width:120px"><label>Preserve Bass</label><select id="m_pb"><option>yes</option><option>no</option></select></div>
    </div>
  </div>
  <button id="f_go" class="btn primary big" style="margin-top:14px">Mastering Sekarang</button>
  <div id="f_result" class="result hidden"></div>
  <script>
    document.querySelectorAll('.tab-bar button').forEach(b=>b.addEventListener('click',e=>{
      document.querySelectorAll('.tab-bar button').forEach(x=>x.classList.remove('active'));
      e.target.classList.add('active');
      const t = e.target.dataset.tab;
      document.getElementById('tab-easy').style.display = t==='easy'?'block':'none';
      document.getElementById('tab-custom').style.display = t==='custom'?'block':'none';
    }));
  </script>`;
}
function chatToolHtml(id){
  return `
  <h2>💬 Chat — ${id}</h2>
  <label>Prompt</label><textarea id="f_prompt" placeholder="Tanya apa saja..."></textarea>
  <button id="f_go" class="btn primary big" style="margin-top:14px">Kirim</button>
  <div id="f_result" class="result hidden"></div>`;
}
function slider(label,id,min,max,val,step){
  return `<label>${label}</label>
  <div class="slider-row">
    <input type="range" min="${min}" max="${max}" step="${step}" value="${val}" id="${id}" oninput="document.getElementById('${id}n').value=this.value"/>
    <input type="number" min="${min}" max="${max}" step="${step}" value="${val}" id="${id}n" oninput="document.getElementById('${id}').value=this.value"/>
  </div>`;
}

// === Submit handler ===
function bindToolForm(modelId, kind){
  document.getElementById('f_go').onclick = async ()=>{
    const goBtn = document.getElementById('f_go');
    goBtn.disabled = true; goBtn.textContent = '⏳ Memproses...';
    try {
      const input = {};
      const ref = document.getElementById('f_refs');
      const audio = document.getElementById('f_audio');
      const refVid = document.getElementById('f_refvid');

      async function up(fileEl, kindHint='image'){
        if (!fileEl?.files?.length) return [];
        const fd = new FormData();
        [...fileEl.files].forEach(f=>fd.append('files', f));
        fd.append('kind', kindHint);
        const r = await fetch(API+'/common/upload-multi',{method:'POST',body:fd,headers:authHdr(false)}).then(r=>r.json());
        return (r.data||[]).map(x=>x.url);
      }
      async function upOne(fileEl, kindHint){
        if (!fileEl?.files?.[0]) return null;
        const fd = new FormData();
        fd.append('file', fileEl.files[0]);
        fd.append('kind', kindHint);
        const r = await fetch(API+'/common/upload',{method:'POST',body:fd,headers:authHdr(false)}).then(r=>r.json());
        return r.data?.url || null;
      }

      if (kind==='image' || kind==='video'){
        input.prompt = val('f_prompt');
        input.aspectRatio = val('f_ar');
        input.resolution = val('f_res');
        if (kind==='video') input.duration = Number(val('f_dur'));
        const refs = await up(ref,'image');
        if (refs.length) input.referenceImages = refs;
        if (kind==='video'){
          const rv = await upOne(refVid,'video');
          if (rv) input.referenceVideo = rv;
        }
      } else if (kind==='audio'){
        if (modelId==='aimastering'){
          input.audioUrl = await upOne(audio,'audio');
          input.referenceAudioUrl = await upOne(document.getElementById('m_ref'),'audio');
          input.mode = document.querySelector('.tab-bar button.active')?.dataset.tab || 'easy';
          input.limiter = val('m_lim')==='on';
          input.targetLoudnessMode = val('m_tlm');
          input.targetLoudness = Number(val('m_tl'));
          input.ceilingMode = val('m_cm');
          input.ceiling = Number(val('m_c'));
          input.oversample = Number(val('m_os'));
          input.automaticLevel = Number(val('m_aml'));
          input.outputFormat = val('m_of');
          input.sampleRate = Number(val('m_sr'));
          input.algorithm = val('m_alg');
          input.lowCutFreq = Number(val('m_lc'));
          input.highCutFreq = Number(val('m_hc'));
          input.preserveBass = val('m_pb')==='yes';
        } else {
          input.audioUrl = await upOne(audio,'audio');
          input.title = val('f_title');
          input.style = val('f_style');
          input.lyrics = val('f_lyrics');
          input.vocal = val('f_vocal');
          input.negativeTags = val('f_neg');
          input.styleWeight = Number(val('f_sw'));
          input.weirdnessConstraint = Number(val('f_wc'));
          input.audioWeight = Number(val('f_aw'));
        }
      } else if (kind==='chat'){
        input.prompt = val('f_prompt');
      }

      const res = await fetch(API+'/jobs/createTask',{method:'POST',headers:authHdr(true),body:JSON.stringify({model:modelId,input})}).then(r=>r.json());
      if (!res.ok) throw new Error(res.error || 'Gagal membuat task');
      const taskId = res.data.taskId;
      document.getElementById('f_result').classList.remove('hidden');
      document.getElementById('f_result').innerHTML = `<p>⏳ Task <code>${taskId}</code> diproses...</p>`;
      pollTask(taskId, modelId, kind);
    } catch (e) {
      const box = document.getElementById('f_result');
      box.classList.remove('hidden');
      box.innerHTML = `<p style="color:#ef4444">❌ ${e.message}</p>
      <p class="muted small">Jika kamu pakai <b>API Key Sendiri</b> (mode OFF), pastikan key sudah ditambahkan & berstatus 🟢 aktif di <a href="#" id="goKeys">🔑 API Key Saya</a>.</p>`;
      document.getElementById('goKeys')?.addEventListener('click', ev=>{ ev.preventDefault(); closeModal(); openKeysManager(); });
    } finally {
      goBtn.disabled = false;
      goBtn.textContent = kind==='audio' && modelId==='aimastering' ? 'Mastering Sekarang' : (kind==='chat'?'Kirim':'Generate Sekarang');
    }
  };
}
const val = id => document.getElementById(id)?.value || '';

async function pollTask(taskId, modelId, kind){
  let tries = 0;
  const box = document.getElementById('f_result');
  const tick = async ()=>{
    tries++;
    const r = await fetch(`${API}/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}&model=${encodeURIComponent(modelId)}`,{headers:authHdr(false)}).then(r=>r.json());
    const t = r.data || {};
    if (t.state === 2){
      const urls = t.resultJson?.resultUrls || [];
      box.innerHTML = renderResult(kind, urls, taskId);
      bindEqualizer();
      return;
    }
    if (t.state === 3){ box.innerHTML = `<p style="color:#ef4444">❌ Gagal: ${t.raw?.error || 'unknown'}</p>`; return; }
    box.innerHTML = `<p>⏳ Status: ${labelState(t.state)} (${tries})</p>`;
    if (tries < 60) setTimeout(tick, 3000);
  };
  tick();
}
function labelState(s){ return ({0:'antri',1:'proses',2:'sukses',3:'gagal'})[s] ?? '...'; }

function renderResult(kind, urls, taskId){
  if (!urls.length) return '<p>Hasil belum tersedia.</p>';
  if (kind==='image'){
    return urls.map((u,i)=>`
      <div><img src="${u}" alt="hasil"/></div>
      <div class="player">
        <a class="btn primary" href="${u}" download="kreaverse-${taskId}-${i}.png">⬇ Download HD</a>
        <a class="btn ghost" href="${u}" target="_blank" rel="noopener">🔍 Lihat Full</a>
      </div>`).join('');
  }
  if (kind==='video'){
    return urls.map((u,i)=>`
      <video controls playsinline src="${u}"></video>
      <div class="player">
        <a class="btn primary" href="${u}" download="kreaverse-${taskId}-${i}.mp4">⬇ Download HD</a>
      </div>`).join('');
  }
  if (kind==='audio'){
    return urls.map((u,i)=>`
      <audio id="aud${i}" controls src="${u}" crossorigin="anonymous"></audio>
      <div class="player">
        <a class="btn primary" href="${u}" download="kreaverse-${taskId}-${i}.mp3">⬇ Download HD</a>
      </div>
      <div class="eq">
        <div><label>Treble</label><input type="range" min="-12" max="12" value="0" data-eq="treble" data-target="aud${i}"/></div>
        <div><label>Mid</label><input type="range" min="-12" max="12" value="0" data-eq="mid" data-target="aud${i}"/></div>
        <div><label>Bass</label><input type="range" min="-12" max="12" value="0" data-eq="bass" data-target="aud${i}"/></div>
      </div>`).join('');
  }
  return `<pre style="white-space:pre-wrap">${JSON.stringify(urls,null,2)}</pre>`;
}

// === Equalizer (WebAudio) ===
function bindEqualizer(){
  document.querySelectorAll('audio').forEach(audio=>{
    if (audio._eqBound) return; audio._eqBound = true;
    try {
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      const src = ctx.createMediaElementSource(audio);
      const bass = ctx.createBiquadFilter(); bass.type='lowshelf';  bass.frequency.value=200;
      const mid  = ctx.createBiquadFilter(); mid.type='peaking';    mid.frequency.value=1000; mid.Q.value=1;
      const treb = ctx.createBiquadFilter(); treb.type='highshelf'; treb.frequency.value=3000;
      src.connect(bass).connect(mid).connect(treb).connect(ctx.destination);
      audio._eqFilters = { bass, mid, treble: treb };
    } catch(e){ console.warn('EQ disabled (CORS):', e.message); }
  });
  document.querySelectorAll('input[data-eq]').forEach(slider=>{
    slider.oninput = e=>{
      const a = document.getElementById(slider.dataset.target);
      const f = a?._eqFilters?.[slider.dataset.eq];
      if (f) f.gain.value = Number(e.target.value);
    };
  });
}

// === Pay WhatsApp ===
document.getElementById('btnPay').addEventListener('click', e=>{
  e.preventDefault();
  const wa = '6285119821813';
  const msg = encodeURIComponent('Halo admin kreaverse-ai, saya [nama] sudah melakukan pembayaran sebesar Rp 700.000 untuk akses 3 bulan unlimited. Mohon kirimkan kode akses login (email & password). Terima kasih.');
  window.open(`https://wa.me/${wa}?text=${msg}`,'_blank');
});

// === Invite ===
document.getElementById('btnMakeInvite').addEventListener('click', async ()=>{
  if (needLogin()) return;
  const r = await fetch(API+'/user/invite',{method:'POST',headers:authHdr(true)}).then(r=>r.json());
  if (!r.ok) return alert(r.error||'gagal');
  document.getElementById('inviteOut').value = r.data.inviteUrl + ' (kode: '+r.data.code+')';
});
document.getElementById('btnRedeem').addEventListener('click', async ()=>{
  if (needLogin()) return;
  const code = document.getElementById('inviteCode').value.trim();
  const r = await fetch(API+'/user/invite/redeem',{method:'POST',headers:authHdr(true),body:JSON.stringify({code})}).then(r=>r.json());
  if (!r.ok) return alert(r.error||'gagal');
  alert('✅ Trial 3 hari aktif sampai '+new Date(r.data.expiresAt).toLocaleString('id-ID'));
});

// === Service cards CTA -> open relevant model from provider ===
document.querySelectorAll('[data-open]').forEach(b=>{
  b.addEventListener('click', ()=>{
    const map = { 'image-tool':'kie-flux','video-tool':'kie-kling','audio-tool':'suno','chat-tool':'deepseek-chat' };
    const kindMap = { 'image-tool':'image','video-tool':'video','audio-tool':'audio','chat-tool':'chat' };
    const id = map[b.dataset.open]; if (!id) return;
    if (b.dataset.preset === 'dangdut'){
      openModelTool(id,'audio');
      setTimeout(()=>{
        const st = document.getElementById('f_style'); if (st) st.value = 'dangdut koplo, sape, kendang, suling';
        const ti = document.getElementById('f_title'); if (ti) ti.value = 'Lagu Dangdut kreaverse-ai';
      }, 50);
      return;
    }
    openModelTool(id, kindMap[b.dataset.open]);
  });
});

// === Keys manager ===
function openKeysManager(){
  if (needLogin()) return;
  fetch(API+'/user/keys',{headers:authHdr(false)}).then(r=>r.json()).then(d=>{
    const bucket = d.data || {};
    const providers = (STATE.info?.providers||[]).map(p=>p.id);
    const provLabel = (id) => (STATE.info?.providers||[]).find(p=>p.id===id)?.name || id;
    openModal(`
      <h2>🔑 Manajemen API Key</h2>
      <p class="muted">Mode <b>${STATE.apiUnlimited?'🟢 ON (Unlimited)':'🔴 OFF (Key Sendiri)'}</b>. ${STATE.apiUnlimited?'Saat ini memakai server owner. Klik tombol "Unlimited" di navbar untuk pakai key sendiri.':'Saat ini memakai API key milikmu. Setelah ditambahkan & dicek 🟢, langsung bisa pakai semua tool tanpa setting Vercel.'}</p>
      <label>Provider</label>
      <select id="kProv">${providers.map(p=>`<option value="${p.toUpperCase().replace('-','_')}_API_KEY">${provLabel(p)}</option>`).join('')}</select>
      <label>API Key</label><input id="kKey" placeholder="sk-..." autocomplete="off"/>
      <div class="row">
        <button id="kAdd" class="btn primary">Tambah</button>
        <button id="kCheck" class="btn ghost">Simpan & Cek Otomatis</button>
        <a class="btn ghost" id="kGet" target="_blank" rel="noopener">Get API Key →</a>
        <button id="kClear" class="btn ghost" style="margin-left:auto">Hapus Semua</button>
      </div>
      <div id="kList" style="margin-top:14px"></div>
    `);
    renderKeys(bucket);
    document.getElementById('kAdd').onclick = async ()=>{
      if (!val('kKey').trim()) return alert('API key kosong');
      const r = await fetch(API+'/user/keys',{method:'POST',headers:authHdr(true),body:JSON.stringify({provider:val('kProv'),key:val('kKey').trim()})}).then(r=>r.json());
      if (!r.ok) return alert(r.error);
      document.getElementById('kKey').value='';
      openKeysManager();
    };
    document.getElementById('kCheck').onclick = async ()=>{
      const btn = document.getElementById('kCheck');
      btn.textContent='⏳ Mengecek...'; btn.disabled=true;
      const r = await fetch(API+'/user/keys/check',{method:'POST',headers:authHdr(true)}).then(r=>r.json());
      btn.textContent='Simpan & Cek Otomatis'; btn.disabled=false;
      renderKeys(r.data||{});
    };
    document.getElementById('kClear').onclick = async ()=>{
      if (!confirm('Hapus SEMUA API key?')) return;
      await fetch(API+'/user/keys',{method:'DELETE',headers:authHdr(true),body:JSON.stringify({})});
      openKeysManager();
    };
    document.getElementById('kProv').onchange = e=>{
      const map = {
        KIE_AI_API_KEY:'https://kie.ai', APIBOX_API_KEY:'https://api.box',
        APIFRAME_API_KEY:'https://apiframe.ai', CRUN_AI_API_KEY:'https://crun.ai',
        SUNO_API_KEY:'https://sunoapi.org', EVOLINK_API_KEY:'https://evolink.ai',
        AIMASTERING_API_KEY:'https://aimastering.com', DEEPSEEK_API_KEY:'https://platform.deepseek.com',
        LEONARDO_API_KEY:'https://app.leonardo.ai', GEMINI_API_KEY:'https://aistudio.google.com',
        GROK_API_KEY:'https://console.x.ai'
      };
      document.getElementById('kGet').href = map[e.target.value] || '#';
    };
    document.getElementById('kProv').dispatchEvent(new Event('change'));
  });
}
function renderKeys(bucket){
  const out = document.getElementById('kList'); if (!out) return;
  const entries = Object.entries(bucket);
  out.innerHTML = entries.length ? entries.map(([prov,arr])=>`
    <h3 style="margin-top:14px;font-size:1rem">${prov}</h3>
    ${arr.map((k,i)=>`
      <div class="key-row">
        <code>${k.key.slice(0,8)}••••${k.key.slice(-4)}</code>
        <span class="pill ${k.status==='active'?'active':(k.status==='inactive'?'inactive':'pending')}">${k.status||'pending'}</span>
        <button class="btn ghost sm" data-del="${prov}|${i}">Hapus</button>
      </div>`).join('')}
  `).join('') : '<p class="muted">Belum ada API key. Tambahkan di atas, lalu klik <b>Simpan & Cek Otomatis</b>.</p>';
  out.querySelectorAll('[data-del]').forEach(b=>b.onclick = async ()=>{
    const [prov,idx] = b.dataset.del.split('|');
    await fetch(API+'/user/keys',{method:'DELETE',headers:authHdr(true),body:JSON.stringify({provider:prov,index:Number(idx)})});
    openKeysManager();
  });
}
