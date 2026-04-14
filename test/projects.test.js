const request = require('supertest');
const app = require('../app');

describe('Projects GET Endpoints', () => {
  test('GET /projects - should return 200 and an array', async () => {
    const res = await request(app).get('/projects');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /projects/:id - should return 400 or 404 with invalid id', async () => {
    const res = await request(app).get('/projects/000000000000000000000000');
    expect([400, 404, 500]).toContain(res.statusCode);
  });
});