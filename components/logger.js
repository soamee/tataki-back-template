const pino = require('pino');

/* eslint-disable */
module.exports = ({ level = 'info' }) => (process.env.NODE_ENV === 'test' ?
{
  info: console.log,
  warn: console.log,
  debug: console.log,
  error: console.error,
} :
pino({ level }));
/* eslint-enable */
