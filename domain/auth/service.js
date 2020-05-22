const _ = require('underscore');
const bcrypt = require('bcrypt');
const logger = require('../../components/logger')({});
const validator = require('./validator');
const {
  createToken,
  verifyToken,
} = require('../../utils/auth');

module.exports = ({ db }) => {
  const login = async ({ email, password }) => {
    try {
      const validation = validator({ email, password });

      if (validation.error) {
        const error = {
          code: 'auth.login.validation',
          message: validation.error.details,
        };
        throw error;
      }

      const user = await db.User.findOne({
        where: { email },
        plain: true,
        paranoid: false,
        attributes: { include: ['password'] },
      });

      if (!user) {
        const error = {
          code: 'user.not_found',
          message: 'Authentication failed. User not found.',
        };
        throw error;
      }

      if (user.deletedAt) {
        await user.restore();
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        logger.error('Password is wrong');
        const error = {
          code: 'password.wrong',
          message: 'Wrong password.',
        };
        throw error;
      }

      logger.info(`User ${user.email} correctly logged in`);
      const token = createToken({ id: user.id, email: user.email });
      return {
        user: _.pick(user, 'id', 'email', 'firstName', 'lastName'),
        token,
      };
    } catch (err) {
      const error = {
        code: 'auth.login.error',
        message: err,
      };
      throw error;
    }
  };

  const isAuthenticated = async (args) => {
    try {
      if (!args.token) {
        const error = {
          code: 'token.empty',
          message: 'The user token is empty.',
        };
        throw error;
      }
      const token = await verifyToken(args.token);
      return token;
    } catch (err) {
      const error = {
        code: 'user.unauthenticated',
        message: 'You must be authenticated.',
      };
      throw error;
    }
  };

  return {
    login,
    isAuthenticated,
  };
};
