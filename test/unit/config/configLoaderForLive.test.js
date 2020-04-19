/* eslint-disable */
const should = require('chai').should();
const path = require('path');

describe('Config Loader', () => {
  it('load production environment with process.env.NODE_ENV=production', () => {
    process.env.NODE_ENV = 'production';
    require('../../utils/requireNoCache')(path.join(__dirname, '../../../config')).ENVIRONMENT.should.equal('production');
  });
});
/* eslint-enable */
