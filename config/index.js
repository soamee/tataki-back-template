const dotenvParseVariables = require('dotenv-parse-variables');
const dotenv = require('dotenv');

const envFile = `.env.${process.env.NODE_ENV}`;

let env = dotenv.config({ path: envFile });

if (env.parsed) {
  env = dotenvParseVariables(env.parsed);
}

module.exports = env;
