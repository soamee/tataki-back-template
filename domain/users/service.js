const Sequelize = require('sequelize');

const bcrypt = require('bcrypt');

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
      });
      return {
        data: users,
        next: 1,
      };
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

  const update = async ({ id, body }) => {
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

  const remove = async ({ id }) => {
    try {
      const deletedUser = await db.User.destroy({
        where: { id },
      });

      if (deletedUser) {
        return {
          userId: id,
          deleted: true,
        };
      }
      return {
        userId: id,
        deleted: false,
      };
    } catch (err) {
      const error = {
        code: 'users.delete',
        message: err,
      };
      throw error;
    }
  };

  const changePassword = async ({ user, data }) => {
    const { id } = user;
    const { oldPassword, password, email } = data;
    try {
      const foundUserWithPassword = await db.User.findOne({
        where: { id },
        plain: true,
        attributes: { include: ['password'] },
      });
      if (email !== foundUserWithPassword.email) {
        const error = {
          code: 'users.not_found',
          message: 'The email does not correspond to the users email',
        };
        throw error;
      }
      const passwordMatch = await bcrypt.compare(oldPassword, foundUserWithPassword.password);
      if (!passwordMatch) {
        const error = {
          code: 'users.changePassword',
          message: 'Password does not match',
        };
        throw error;
      }
      const encriptedNewPassword = await encryptPassword(password);
      const updatedUser = await foundUserWithPassword.update({
        password: encriptedNewPassword,
      });
      return updatedUser;
    } catch (err) {
      const error = {
        code: 'users.changePassword',
        message: err,
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
    remove,
    changePassword,
  };
};
