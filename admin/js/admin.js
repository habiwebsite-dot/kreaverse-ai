let adminToken = localStorage.getItem('adminToken') || '';
async function adminLogin() {
  try {
    const res = await apiRequest('/api/v1/admin/login', { method: 'POST', body: JSON.stringify({ email: document.getElementById('adminEmail').value, password: document.getElementById('adminPassword').value }) });
    adminToken = res.data.token; localStorage.setItem('adminToken', adminToken); showPanel();
  } catch(e) { alert('Login gagal'); }
}
async function showPanel() {
  document.getElementById('adminLogin').style.display = 'none';
  document.getElementById('adminContent').style.display = 'block';
  loadUsers(); loadApiKeys(); loadSettings();
}
async function loadUsers() {
  const res = await apiRequest('/api/v1/admin/users', { headers: { Authorization: `Bearer ${adminToken}` } });
  document.getElementById('userList').innerHTML = res.data.map(u => `<p>${u.email} - ${u.role} | Unlimited:${u.unlimited}</p>`).join('');
}
async function loadApiKeys() {
  const res = await apiRequest('/api/v1/admin/api-keys', { headers: { Authorization: `Bearer ${adminToken}` } });
  document.getElementById('apiKeysList').innerHTML = res.data.map(k => `<p>${k.email} - ${k.provider}: ${k.decrypted_key}</p>`).join('');
}
async function createUser() {
  await apiRequest('/api/v1/admin/users', { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ email: document.getElementById('newEmail').value, password: document.getElementById('newPass').value, subscription_end: document.getElementById('subEnd').value ? new Date(document.getElementById('subEnd').value).toISOString() : null, unlimited: 1 }) });
  loadUsers();
}
async function loadSettings() {
  const res = await apiRequest('/api/v1/admin/settings');
  if (res.data) {
    document.getElementById('qrUrl').value = res.data.payment_qr_url || '';
    document.getElementById('waNum').value = res.data.whatsapp_number || '';
    if (res.data.bank_transfer) {
      document.getElementById('bankName').value = res.data.bank_transfer.bank_name || '';
      document.getElementById('bankAcc').value = res.data.bank_transfer.account_number || '';
      document.getElementById('bankHolder').value = res.data.bank_transfer.account_holder || '';
    }
    document.getElementById('promoText').value = res.data.promo_banner?.text || '';
    document.getElementById('promoLink').value = res.data.promo_banner?.link || '';
    document.getElementById('adsenseCode').value = res.data.adsense_code || '';
  }
}
async function saveSettings() {
  await apiRequest('/api/v1/admin/settings', { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({
    payment_qr_url: document.getElementById('qrUrl').value,
    whatsapp_number: document.getElementById('waNum').value,
    bank_transfer: { bank_name: document.getElementById('bankName').value, account_number: document.getElementById('bankAcc').value, account_holder: document.getElementById('bankHolder').value },
    promo_banner: { active: true, text: document.getElementById('promoText').value, link: document.getElementById('promoLink').value },
    adsense_code: document.getElementById('adsenseCode').value
  })});
  alert('Tersimpan');
}
if (adminToken) showPanel();