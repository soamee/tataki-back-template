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

exports.verifyToken = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      logger.info('[verifyToken] error while decoding JWT token', err);
      return reject(err);
    }
    return resolve(user);
  });
});

exports.comparePassword = (currentPassword, candidatePassword, callback) => (
  bcrypt.compare(candidatePassword, currentPassword, (err, isMatch) => {
    if (err) {
      logger.error(err);
      return callback(err);
    }
    return callback(null, isMatch);
  })
);

exports.encryptPassword = (password) => new Promise((resolve, reject) => {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      logger.info('[encryptPassword] error while encrypt password', err);
      return reject(err);
    }
    return resolve(hash);
  });
});

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
