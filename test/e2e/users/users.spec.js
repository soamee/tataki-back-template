const supertest = require('supertest');
const { OK, BAD_REQUEST } = require('http-status-codes');
const app = require('../../../app');
const db = require('../../../db');
const seed = require('../../seed');
const truncate = require('../../truncate');

const request = supertest(app);

describe('Users', () => {
  beforeEach(async () => {
    await db.init();
    await seed();
  });

  it('Get all users', async (done) => {
    const response = await request.get('/users');
    expect(response.status).toBe(OK);
    expect(response.body).toHaveLength(2);
    done();
  });

  it('Get filtered users', async (done) => {
    const response = await request.get('/users?email=jmanzano');
    expect(response.status).toBe(OK);
    expect(response.body).toHaveLength(1);
    done();
  });

  it('Creates user', async (done) => {
    let response = await request.post('/users').send({
      email: 'jmanza@soamee.com',
      password: '121234',
      firstName: 'Other',
      lastName: 'Hey',
    });
    expect(response.status).toBe(OK);
    expect(response.body.email).toBe('jmanza@soamee.com');

    response = await request.get('/users');
    expect(response.status).toBe(OK);
    expect(response.body).toHaveLength(3);
    done();
  });

  it('Fails creating user because it has no email', async (done) => {
    const response = await request
      .post('/users')
      .send({ password: '121234', firstName: 'Other', lastName: 'Hey' });
    expect(response.status).toBe(BAD_REQUEST);
    done();
  });

  afterEach(async (done) => {
    await truncate();
    done();
  });

  afterAll(async (done) => {
    await db.stop();
    done();
  });
});
