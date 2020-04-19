/* eslint-disable */
const should = require('chai').should();
const path = require('path');

describe('Config Loader', () => {
  it('load dev environment with process.env.NODE_ENV=dev', () => {
    process.env.NODE_ENV = 'dev';
    require('../../utils/requireNoCache')(path.join(__dirname, '../../../config')).ENVIRONMENT.should.equal('dev');
  });
});
/* eslint-enable */
