const API_BASE = '/api/v1';
async function apiRequest(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }), ...options.headers };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
async function loginUser(email, password) {
  const res = await apiRequest(`${API_BASE}/user/login`, { method: 'POST', body: JSON.stringify({ email, password }) });
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('role', res.data.role);
  return res.data;
}
function logout() { localStorage.removeItem('token'); localStorage.removeItem('role'); window.location.hash = '#/'; location.reload(); }
function isLoggedIn() { return !!localStorage.getItem('token'); }