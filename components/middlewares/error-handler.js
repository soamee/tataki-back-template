const logger = require('../logger');

module.exports = (err, req, res) => {
  const status = err.status || err.statusCode || 500;
  // if (err instanceof swaggerValidator.InputValidationError) {
  //   logger.error(`SWAGGER VALIDATION: ${JSON.stringify(err.errors)}`);
  //   return res.status(UNPROCESSABLE_ENTITY).json({ message: err.errors });
  // }
  // if (err instanceof PreconditionsError) {
  //   logger.error(`INTERNAL SERVER ERROR: ${err.stack}`);
  //   return res.status(PRECONDITION_FAILED).json({ message: 'Precondition Failed' });
  // }
  // if (err instanceof ResourceNotFoundError) {
  //   return res.status(NOT_FOUND).json({ message: 'Not found' });
  // }
  logger.error(err);
  res.status(status).json({ message: 'An error occured and was logged', err: err.message });
};
