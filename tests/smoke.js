/**
 * kreaverse-ai - smoke test (tanpa framework)
 * Jalankan: node tests/smoke.js
 */
process.env.JWT_SECRET = 'test';
const app = require('../src/index');
const http = require('http');

const srv = app.listen(0, () => {
  const port = srv.address().port;
  const get = (path) => new Promise((res, rej) => {
    http.get(`http://127.0.0.1:${port}${path}`, (r) => {
      let b = ''; r.on('data', c => b += c); r.on('end', () => res({ status: r.statusCode, body: b }));
    }).on('error', rej);
  });
  (async () => {
    const info = await get('/api/v1/info');
    console.log('GET /api/v1/info ->', info.status);
    if (info.status !== 200) process.exit(1);
    const j = JSON.parse(info.body);
    if (!j.providers || j.providers.length !== 11) {
      console.error('Expect 11 providers, got', j.providers?.length); process.exit(1);
    }
    console.log('✅ smoke passed, providers =', j.providers.length, ', models =', j.models.length);
    srv.close();
  })();
});
