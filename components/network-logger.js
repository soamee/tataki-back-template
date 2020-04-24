
const expressPino = require('express-pino-logger');

module.exports = ({ app, logger }) => {
  if (process.env.NODE_ENV !== 'test') {
    const expressLogger = expressPino({ logger });
    app.use(expressLogger);
  }
};
