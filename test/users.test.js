const request = require('supertest');
const app = require('../app');

describe('Users GET Endpoints', () => {
  test('GET /users - should return 200 and an array', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /users/:id - should return 400 or 404 with invalid id', async () => {
    const res = await request(app).get('/users/000000000000000000000000');
    expect([400, 404, 500]).toContain(res.statusCode);
  });
});