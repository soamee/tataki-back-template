const supertest = require('supertest');
const app = require('../../../app');
const db = require('../../../db');

const request = supertest(app);

describe('Health & test suite', () => {
  beforeEach(async () => {
    await db.init();
  });
  it('Testing to see if tests work', async (done) => {
    expect(1).toBe(1);
    done();
  });
  it('GET health endpoint', async (done) => {
    const response = await request.get('/health');
    expect(response.status).toBe(200);
    done();
  });

  afterAll(async (done) => {
    await db.stop();
    done();
  });
});
