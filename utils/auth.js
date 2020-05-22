const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UNAUTHORIZED } = require('http-status-codes');
const logger = require('../components/logger')({});

const { JWT_SECRET } = require('../config');

exports.getTokenFromRequest = (req) => (
  req.body.token || req.query.token || req.headers.authorization
);

exports.createToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  return jwt.sign(payload, JWT_SECRET, {});
};

exports.verifyToken = (token) => {
  try {
    const decodedUser = jwt.verify(token, JWT_SECRET);
    return decodedUser;
  } catch (err) {
    logger.info('[verifyToken] error while decoding JWT token', err);
    throw err;
  }
};

exports.encryptPassword = (password) => bcrypt.hash(password, 10);

exports.injectUser = async (req, res, next) => {
  if (
    !req.headers.authorization
    || req.headers.authorization === undefined
    || req.headers.authorization === 'undefined'
  ) {
    return res.status(UNAUTHORIZED).send();
  }
  const user = await exports.verifyToken(
    req.headers.authorization.split(' ')[1],
  );
  req.user = user;
  return next();
};
