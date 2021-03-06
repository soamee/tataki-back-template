const supertest = require('supertest');
const {
  OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, BAD_REQUEST, CREATED,
} = require('http-status-codes');
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

  it('Deletes an user', async (done) => {
    const loginResponse = await request.post('/auth/login').send({
      email: 'jmanzano@soamee.com',
      password: '12341234',
    });
    const usersResponse = await request.get('/users');
    const userId = usersResponse.body.data[0].id;
    const response = await request
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`);
    expect(response.status).toBe(OK);
    expect(response.body.deleted).toBe(true);
    const deletedUserResponse = await request.get(`/users/${userId}`);
    expect(deletedUserResponse.body.message).toBe('Error while finding user Error: This user was deleted or does not exists');
    done();
  });

  it('Cant delete an user if not an admin', async (done) => {
    const loginResponse = await request.post('/auth/login').send({
      email: 'imateo@soamee.com',
      password: '12341234',
    });
    const usersResponse = await request.get('/users');
    const userId = usersResponse.body.data[0].id;
    const response = await request
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`);
    expect(response.status).toBe(UNAUTHORIZED);
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
    expect(response.status).toBe(CREATED);
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
    expect(response.status).toBe(BAD_REQUEST);
    done();
  });

  it('Changes password and login with new password', async (done) => {
    const loginResponse = await request
      .post('/auth/login')
      .send({
        email: 'jmanzano@soamee.com',
        password: '12341234',
      });
    const response = await request
      .put('/users/change-password')
      .send({ email: 'jmanzano@soamee.com', password: '1919', oldPassword: '12341234' })
      .set('Authorization', `Bearer ${loginResponse.body.token}`);
    expect(response.status).toBe(OK);
    const newLoginResponse = await request
      .post('/auth/login')
      .send({
        email: 'jmanzano@soamee.com',
        password: '1919',
      });
    expect(newLoginResponse.status).toBe(OK);
    done();
  });

  it('Fails changing password because e-mail does not correspond to the user e-mail', async (done) => {
    const loginResponse = await request
      .post('/auth/login')
      .send({
        email: 'jmanzano@soamee.com',
        password: '12341234',
      });
    const response = await request
      .put('/users/change-password')
      .send({ email: 'imateo@soamee.com', password: '1919', oldPassword: '12341234' })
      .set('Authorization', `Bearer ${loginResponse.body.token}`);
    expect(response.status).toBe(INTERNAL_SERVER_ERROR);
    expect(response.body.message.message).toBe('The email does not correspond to the users email');
    done();
  });

  it('Fails changing password because old password does not match', async (done) => {
    const loginResponse = await request
      .post('/auth/login')
      .send({
        email: 'jmanzano@soamee.com',
        password: '12341234',
      });
    const response = await request
      .put('/users/change-password')
      .send({ email: 'jmanzano@soamee.com', password: '1919', oldPassword: '12345678' })
      .set('Authorization', `Bearer ${loginResponse.body.token}`);
    expect(response.status).toBe(INTERNAL_SERVER_ERROR);
    expect(response.body.message.message).toBe('Password does not match');
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
