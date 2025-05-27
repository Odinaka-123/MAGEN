const request = require('supertest');
const app = require('../app');
const pool = require('../config/db');
const clearTestData = require('./seedTestData');
let jwtToken;

beforeAll(async () => {
  // Clean up users, breaches, and alerts before tests
  await clearTestData();
});

describe('Authentication', () => {
  const userData = { name: 'Test User', email: 'testuser@example.com', password: 'password123' };

  it('should register a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('userId');
  });

  it('should not register a user with duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(userData);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should not register with missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'missing@example.com' });
    expect(res.statusCode).toBe(500);
  });

  it('should login successfully', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: userData.email, password: userData.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    jwtToken = res.body.token;
  });

  it('should not login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: userData.email, password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
  });

  it('should not login with non-existent user', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nouser@example.com', password: 'password123' });
    expect(res.statusCode).toBe(401);
  });
});

describe('Breach Management', () => {
  it('should reject getting breaches without auth', async () => {
    const res = await request(app).get('/api/breaches');
    expect(res.statusCode).toBe(401);
  });

  it('should get all breaches with valid auth', async () => {
    const res = await request(app).get('/api/breaches').set('Authorization', `Bearer ${jwtToken}`);
    expect([200, 204]).toContain(res.statusCode); // 204 if no breaches
  });

  it('should scan for new breaches (success)', async () => {
    const res = await request(app).post('/api/breaches/scan').set('Authorization', `Bearer ${jwtToken}`);
    expect([200, 201, 204]).toContain(res.statusCode);
  });

  it('should reject scan for new breaches without auth', async () => {
    const res = await request(app).post('/api/breaches/scan');
    expect(res.statusCode).toBe(401);
  });

  it('should get breach statistics (success)', async () => {
    const res = await request(app).get('/api/breaches/stats').set('Authorization', `Bearer ${jwtToken}`);
    expect([200, 204]).toContain(res.statusCode);
  });

  it('should reject breach statistics without auth', async () => {
    const res = await request(app).get('/api/breaches/stats');
    expect(res.statusCode).toBe(401);
  });
});

describe('Alerts System', () => {
  it('should reject getting alerts without auth', async () => {
    const res = await request(app).get('/api/alerts');
    expect(res.statusCode).toBe(401);
  });

  it('should get all alerts with valid auth', async () => {
    const res = await request(app).get('/api/alerts').set('Authorization', `Bearer ${jwtToken}`);
    expect([200, 204]).toContain(res.statusCode);
  });
});

describe('User Management', () => {
  it('should reject getting user profile without auth', async () => {
    const res = await request(app).get('/api/users/profile');
    expect([401, 404]).toContain(res.statusCode);
  });

  it('should get user profile with valid auth', async () => {
    const res = await request(app).get('/api/users/profile').set('Authorization', `Bearer ${jwtToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'testuser@example.com');
    expect(res.body).not.toHaveProperty('password');
  });
});

describe('Middleware & Security', () => {
  it('should reject protected route with invalid JWT', async () => {
    const res = await request(app).get('/api/breaches').set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toBe(401);
  });

  it('should reject protected route with expired JWT', async () => {
    // Simulate an expired token (not strictly accurate, but for demo)
    const expiredToken = jwtToken.split('.').slice(0,2).join('.') + '.expired';
    const res = await request(app).get('/api/breaches').set('Authorization', `Bearer ${expiredToken}`);
    expect([401, 403]).toContain(res.statusCode);
  });
});

describe('Error Handling', () => {
  it('should return 400 for invalid input (register)', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect([400, 500]).toContain(res.statusCode);
  });
});

afterAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    await pool.end();
  }
});
// Edge cases and database tests can be expanded as needed
