let adminToken = localStorage.getItem('adminToken') || '';

async function adminLogin() {
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;
  try {
    const res = await apiRequest('/api/v1/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    adminToken = res.data.token;
    localStorage.setItem('adminToken', adminToken);
    showPanel();
  } catch (e) {
    alert('Login gagal');
  }
}

async function showPanel() {
  if (!adminToken) return;
  document.getElementById('adminLogin').style.display = 'none';
  document.getElementById('adminContent').style.display = 'block';
  loadUsers();
  loadApiKeys();
  loadSettings();
}

async function loadUsers() {
  const res = await apiRequest('/api/v1/admin/users', { headers: { Authorization: `Bearer ${adminToken}` } });
  document.getElementById('userList').innerHTML = res.data.map(u => `<p>${u.email} - ${u.role} | Unlimited:${u.unlimited} | Berakhir:${u.subscription_end||'-'}</p>`).join('');
}

async function loadApiKeys() {
  const res = await apiRequest('/api/v1/admin/api-keys', { headers: { Authorization: `Bearer ${adminToken}` } });
  document.getElementById('apiKeysList').innerHTML = res.data.map(k => `<p>${k.email} - ${k.provider}: ${k.decrypted_key}</p>`).join('');
}

async function createUser() {
  const email = document.getElementById('newEmail').value;
  const password = document.getElementById('newPass').value;
  const subEnd = document.getElementById('subEnd').value;
  await apiRequest('/api/v1/admin/users', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ email, password, subscription_end: subEnd ? new Date(subEnd).toISOString() : null, unlimited: 1 })
  });
  loadUsers();
}

async function loadSettings() {
  const res = await apiRequest('/api/v1/admin/settings');
  if (res.data) {
    document.getElementById('qrUrl').value = res.data.payment_qr_url || '';
    document.getElementById('waNum').value = res.data.whatsapp_number || '';
  }
}

async function saveSettings() {
  await apiRequest('/api/v1/admin/settings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      payment_qr_url: document.getElementById('qrUrl').value,
      whatsapp_number: document.getElementById('waNum').value
    })
  });
  alert('Tersimpan');
}

// Auto show panel if token exists
if (adminToken) showPanel();