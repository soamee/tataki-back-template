const { UNAUTHORIZED } = require('http-status-codes');

const { verifyToken } = require('../../utils/auth');

module.exports = async (req, res, next) => {
  if (
    !req.headers.authorization
    || req.headers.authorization === undefined
    || req.headers.authorization === 'undefined'
  ) {
    return res.status(UNAUTHORIZED).send();
  }
  const user = await verifyToken(
    req.headers.authorization.split(' ')[1],
  );
  req.user = user;
  return next();
};
