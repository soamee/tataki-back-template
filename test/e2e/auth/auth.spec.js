const supertest = require('supertest');
const { OK, UNAUTHORIZED } = require('http-status-codes');
const createApp = require('../../../app');
const db = require('../../../db');
const seed = require('../../seed');
const truncate = require('../../truncate');


describe('Auth', () => {
  let request;

  beforeAll(async (done) => {
    const app = await createApp();
    request = supertest(app);
    done();
  });

  beforeEach(async (done) => {
    await db.initDatabase();
    await seed();
    done();
  });

  it('Login with user', async (done) => {
    const response = await request.post('/auth/login').send({
      email: 'jmanzano@soamee.com',
      password: '12341234',
    });
    expect(response.status).toBe(OK);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('jmanzano@soamee.com');
    done();
  });

  it('Restore deleted user on login', async (done) => {
    const response = await request.post('/auth/login').send({
      email: 'jmanzano@soamee.com',
      password: '12341234',
    });
    const usersResponse = await request.get('/users');
    const userId = usersResponse.body.data[0].id;
    const deleteUserResponse = await request
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${response.body.token}`);
    expect(deleteUserResponse.status).toBe(OK);
    expect(deleteUserResponse.body.deleted).toBe(true);
    expect(response.status).toBe(OK);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('jmanzano@soamee.com');
    done();
  });

  it('Login with non existent user', async (done) => {
    const response = await request.post('/auth/login').send({
      email: 'jmanzan@soamee.com',
      password: '12341234',
    });
    expect(response.status).toBe(UNAUTHORIZED);
    done();
  });

  it('Login with incorrect password existent user', async (done) => {
    const response = await request.post('/auth/login').send({
      email: 'jmanzano@soamee.com',
      password: '1234123',
    });
    expect(response.status).toBe(UNAUTHORIZED);
    done();
  });

  it('Gets info from user', async (done) => {
    let response = await request.post('/auth/login').send({
      email: 'jmanzano@soamee.com',
      password: '12341234',
    });
    expect(response.status).toBe(OK);

    response = await request
      .get('/users/me')
      .set('Authorization', `Bearer ${response.body.token}`);
    expect(response.status).toBe(OK);
    expect(response.body.email).toBe('jmanzano@soamee.com');
    done();
  });

  it('Login with user fail because password is not correct', async (done) => {
    const response = await request.post('/auth/login').send({
      email: 'jmanzano@soamee.com',
      password: '12123',
    });
    expect(response.status).toBe(UNAUTHORIZED);
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
