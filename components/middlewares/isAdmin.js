const { FORBIDDEN } = require('http-status-codes');

const { verifyToken } = require('../../utils/auth');
const db = require('../../db');

module.exports = async (req, res, next) => {
  if (
    !req.headers.authorization
    || req.headers.authorization === undefined
    || req.headers.authorization === 'undefined'
  ) {
    return res.status(FORBIDDEN).send();
  }
  const user = await verifyToken(
    req.headers.authorization.split(' ')[1],
  );

  const databaseUser = await db.User.findByPk(user.id);

  if (databaseUser.role !== 'ADMIN') {
    return res.status(FORBIDDEN).send();
  }

  req.user = user;
  return next();
};
