/* eslint-disable */
require('chai').should();
const path = require('path');

describe('Config Loader', () => {
  it('load dev environment with process.env.NODE_ENV=unknown', () => {
    process.env.NODE_ENV = 'unknown';
    require('../../utils/requireNoCache')(path.join(__dirname, '../../../config')).ENVIRONMENT.should.equal('dev');
  });
});
/* eslint-enable */
