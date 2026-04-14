const request = require('supertest');

const BASE_URL = 'https://cse341-final-project-dafa.onrender.com';

describe('Comments GET Endpoints', () => {
  test('GET /comments - should return 200 and an array', async () => {
    const res = await request(BASE_URL).get('/comments');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /comments/:id - should return 404 or 500 with fake id', async () => {
    const res = await request(BASE_URL).get('/comments/000000000000000000000000');
    expect([404, 500]).toContain(res.statusCode);
  });
});