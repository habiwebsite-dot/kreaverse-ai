const request = require('supertest');
const app = require('../src/index');

describe('Kreaverse AI API Tests', () => {
  let token = '';

  test('GET /api/health should return ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('Kreaverse AI');
  });

  test('GET /api/public/config should return config', async () => {
    const res = await request(app).get('/api/public/config');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('siteName');
    expect(res.body.data).toHaveProperty('providers');
  });

  test('POST /api/auth/login with wrong credentials should fail', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@email.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login with missing fields should return 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com' });
    expect(res.status).toBe(400);
  });

  test('GET /api/v1/user/credits without auth should return 401', async () => {
    const res = await request(app).get('/api/v1/user/credits');
    expect(res.status).toBe(401);
  });

  test('POST /api/v1/jobs/createTask without auth should return 401', async () => {
    const res = await request(app)
      .post('/api/v1/jobs/createTask')
      .send({ provider: 'kie-ai', model: 'flux', input: { prompt: 'test' } });
    expect(res.status).toBe(401);
  });

  test('GET /api/v1/common/models without auth should return 401', async () => {
    const res = await request(app).get('/api/v1/common/models');
    expect(res.status).toBe(401);
  });

  test('GET /api/payment/info should return payment info', async () => {
    const res = await request(app).get('/api/payment/info');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('price');
    expect(res.body.data).toHaveProperty('qrCode');
  });

  test('GET /nonexistent should return index.html (SPA)', async () => {
    const res = await request(app).get('/nonexistent-page');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });
});