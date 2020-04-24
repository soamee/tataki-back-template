const Sequelize = require('sequelize');

const logger = require('../../components/logger')({});

const { createValidator, updateValidator } = require('./validator');

const db = require('../../db');

const { encryptPassword } = require('../../utils/auth');

const { Op } = Sequelize;

module.exports = () => {
  const findAll = async ({ email = '' }) => {
    const where = {};
    if (email) {
      where.email = { [Op.startsWith]: email.toLowerCase() };
    }
    try {
      const users = await db.User.findAll({
        where,
        include: { model: db.Role, as: 'roles' },
      });
      return users;
    } catch (err) {
      const error = {
        code: 'users.findAll',
        message: `Error while finding all users${err}`,
      };
      throw error;
    }
  };

  const findById = async ({ id }) => {
    try {
      const user = await db.User.findOne({
        where: { id },
        include: { model: db.Role, as: 'roles' },
      });
      return user;
    } catch (err) {
      const error = {
        code: 'users.findById',
        message: `Error while finding user ${err}`,
      };
      throw error;
    }
  };

  const findMe = async ({ id }) => {
    try {
      const userMe = await db.User.findOne({
        where: { id },
        include: { model: db.Role, as: 'roles' },
      });
      return userMe;
    } catch (err) {
      const error = {
        code: 'users.findMe',
        message: `Error while finding userMe ${err}`,
      };
      throw error;
    }
  };

  const create = async ({ userToBeCreated }) => {
    try {
      const validation = createValidator(userToBeCreated);
      if (validation.error) {
        const error = {
          code: 'users.validation',
          message: validation.error.details,
        };
        throw error.message;
      }
      const user = await db.User.findOne({
        where: { email: userToBeCreated.email },
      });
      if (user) {
        logger.error('User already exists');
        const error = {
          code: 'user.exists',
          message: 'User with this email already exists,',
        };
        throw error;
      }
      const hash = await encryptPassword(userToBeCreated.password);
      const newUser = await db.User.create({
        ...userToBeCreated,
        password: hash,
      });
      return newUser;
    } catch (err) {
      const error = {
        code: 'user.login.error',
        message: err,
      };
      throw error;
    }
  };

  const update = async (id, body) => {
    const validation = updateValidator(body);
    if (validation.error) {
      const error = {
        code: 'user.validation',
        message: validation.error.details,
      };
      throw error;
    }
    try {
      const updatedUser = await db.User.update(body, {
        where: { id },
        returning: true,
        plain: true,
      });
      return updatedUser[1];
    } catch (err) {
      const error = {
        code: 'user.update',
        message: `Error while updating users ${err}`,
      };
      throw error;
    }
  };

  const getRolesByUser = async ({ id }) => {
    try {
      const user = await db.User.findOne({
        where: { id },
        include: { model: db.Role, as: 'roles' },
      });
      return user.roles;
    } catch (err) {
      const error = {
        code: 'users.roles',
        message: `Error while finding userMe ${err}`,
      };
      throw error;
    }
  };

  return {
    findById,
    create,
    findAll,
    update,
    findMe,
    getRolesByUser,
  };
};
