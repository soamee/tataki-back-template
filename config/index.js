const dotenvParseVariables = require('dotenv-parse-variables');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

let env = dotenv.config({ path: envFile });

if (env.parsed) {
  env = dotenvParseVariables(env.parsed);
}

module.exports = env;
