const supertest = require('supertest');
const { OK } = require('http-status-codes');
const app = require('../../../app');
const db = require('../../../db');
const seed = require('../../seed');
const truncate = require('../../truncate');

const request = supertest(app);

describe('Roles', () => {
  beforeEach(async () => {
    await db.init();
    await seed();
  });

  it('Get roles by user', async (done) => {
    const response = await request.get('/users/10000/roles');
    expect(response.status).toBe(OK);
    expect(response.body).toHaveLength(1);
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
