const pino = require('pino');

module.exports = ({ level = 'info' }) => pino({ level });
