const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  it('should return 201 for successful registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: `test${Date.now()}@example.com`, password: 'password123' });
    expect(res.statusCode).toBe(201);
  });

  it('should return 401 for invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'notfound@example.com', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
  });
});
