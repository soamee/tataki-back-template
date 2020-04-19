const _ = require('underscore');
const logger = require('../../components/logger')({});
const validator = require('./validator');
const {
  createToken,
  verifyToken,
  comparePassword,
} = require('../../utils/auth');

module.exports = ({ db }) => {
  const login = (args) => new Promise((resolve, reject) => {
    const validation = validator(args);
    if (validation.error) {
      return reject(validation.error.details);
    }
    return db.User.findOne({ where: { email: args.email }, plain: true })
      .then((user) => {
        if (!user) {
          logger.error('User not found');
          return reject({
            code: 'user.not_found',
            message: 'Authentication failed. User not found.',
          });
        }
        return comparePassword(
          user.password,
          args.password,
          (err, isMatch) => {
            if (err) {
              return reject(err);
            }
            if (!isMatch) {
              logger.error('Password is wrong');
              return reject({
                code: 'password.wrong',
                message: 'Wrong password.',
              });
            }
            logger.info(`User ${user.email} correctly logged in`);
            const token = createToken({ id: user.id, email: user.email });
            return resolve({
              user: _.pick(user, 'id', 'email', 'firstName', 'lastName'),
              token,
            });
          },
        );
      })
      .catch((err) => reject(err));
  });

  const isAuthenticated = (args) => new Promise((resolve, reject) => {
    if (!args.token) {
      logger.error('The user token is empty');
      return reject({
        code: 'token.empty',
        message: 'The user token is empty.',
      });
    }

    return verifyToken(args.token, (err, decoded) => {
      if (err) {
        logger.error('You must be authenticated');
        return reject({
          code: 'user.unauthenticated',
          message: 'You must be authenticated.',
        });
      }

      return resolve(decoded);
    });
  });

  return {
    login,
    isAuthenticated,
  };
};
