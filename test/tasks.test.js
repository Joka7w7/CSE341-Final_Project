const request = require('supertest');

const BASE_URL = 'https://cse341-final-project-dafa.onrender.com';

describe('Tasks GET Endpoints', () => {
  test('GET /tasks - should return 200 and an array', async () => {
    const res = await request(BASE_URL).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /tasks/:id - should return 404 or 500 with fake id', async () => {
    const res = await request(BASE_URL).get('/tasks/000000000000000000000000');
    expect([404, 500]).toContain(res.statusCode);
  });
});