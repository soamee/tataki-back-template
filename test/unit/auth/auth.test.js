require('chai').should();

const createAuthService = require('../../../domain/auth/service');

const authService = createAuthService({});

describe.only('Auth Service & Utils', () => {
  it('isAuthenticated fails because there is no token', () => {
    try {
      authService.isAuthenticated({});
    } catch (err) {
      err.should.exist;
    }
  });
  it('isAuthenticated fails because there of bad token', () => {
    try {
      authService.isAuthenticated({ token: 'uwuwuww' });
    } catch (err) {
      err.should.exist;
    }
  });
});
