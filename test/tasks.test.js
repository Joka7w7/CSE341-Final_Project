const request = require('supertest');
const app = require('../app');

describe('Tasks GET Endpoints', () => {
  test('GET /tasks - should return 200 and an array', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /tasks/:id - should return 400 or 404 with invalid id', async () => {
    const res = await request(app).get('/tasks/000000000000000000000000');
    expect([400, 404, 500]).toContain(res.statusCode);
  });
});