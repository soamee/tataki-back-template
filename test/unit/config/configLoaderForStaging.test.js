/* eslint-disable */
const should = require('chai').should();
const path = require('path');

describe('Config Loader', () => {
  it('load dev environment with process.env.NODE_ENV=staging', () => {
    process.env.NODE_ENV = 'staging';
    require('../../utils/requireNoCache')(path.join(__dirname, '../../../config')).ENVIRONMENT.should.equal('staging');
  });
});
/* eslint-enable */
