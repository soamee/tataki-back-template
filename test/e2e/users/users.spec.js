const supertest = require('supertest');
const { OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const createApp = require('../../../app');
const db = require('../../../db');
const seed = require('../../seed');
const truncate = require('../../truncate');

describe('Users', () => {
  let request;
  beforeAll(async (done) => {
    const app = await createApp();
    request = supertest(app);
    done();
  });

  beforeEach(async () => {
    await db.initDatabase();
    await seed();
  });

  it('Get all users', async (done) => {
    const response = await request.get('/users');
    expect(response.status).toBe(OK);
    expect(response.body.data).toHaveLength(2);
    done();
  });

  it('Get filtered users', async (done) => {
    const response = await request.get('/users?email=jmanzano');
    expect(response.status).toBe(OK);
    expect(response.body.data).toHaveLength(1);
    done();
  });

  it('Deletes am user', async (done) => {
    const usersResponse = await request.get('/users');
    const userId = usersResponse.body.data[0].id;
    const response = await request.delete(`/users/${userId}`);
    expect(response.status).toBe(OK);
    expect(response.body.deleted).toBe(true);
    const deletedUserResponse = await request.get(`/users/${userId}`);
    expect(deletedUserResponse.body).toBe(null);
    done();
  });

  it('Creates user', async (done) => {
    let response = await request
      .post('/users')
      .send({
        email: 'jmanza@soamee.com',
        password: '121234',
        firstName: 'Other',
        lastName: 'Hey',
      });
    expect(response.status).toBe(OK);
    expect(response.body.email).toBe('jmanza@soamee.com');

    response = await request.get('/users');
    expect(response.status).toBe(OK);
    expect(response.body.data).toHaveLength(3);
    done();
  });

  it('Fails creating user because it has no email', async (done) => {
    const response = await request
      .post('/users')
      .send({ password: '121234', firstName: 'Other', lastName: 'Hey' });
    expect(response.status).toBe(INTERNAL_SERVER_ERROR);
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
