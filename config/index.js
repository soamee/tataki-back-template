/* eslint-disable */
const config = require('./default');
const path = require("path");

let envConfig = {};
try {
  const configFile = path.resolve('config', `./${process.env.NODE_ENV}.json`);
  envConfig = require(configFile);
} catch (e) {
  console.log(`No config found for "${process.env.NODE_ENV}", so falling back to dev.json. ${e}`);
  envConfig = require('./dev.json');
}

module.exports = {
  ...config,
  ...envConfig,
};
/* eslint-enable */
