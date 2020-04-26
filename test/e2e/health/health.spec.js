const supertest = require('supertest');
const createApp = require('../../../app');
const db = require('../../../db');

describe('Health & test suite', () => {
  let request;

  beforeAll(async (done) => {
    const app = await createApp();
    request = supertest(app);
    done();
  });

  beforeEach(async () => {
    await db.initDatabase();
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
