const { createValidator, updateValidator } = require('./validator');

const db = require('../../db');

module.exports = () => {
  const create = async (roleToBeCreated) => {
    const validation = createValidator(roleToBeCreated);
    if (validation.error) {
      const error = {
        code: 'role.validation',
        message: validation.error.details,
      };
      throw error;
    }
    try {
      const newRole = await db.Role.create(roleToBeCreated);
      return newRole;
    } catch (err) {
      const error = {
        code: 'role.create.error',
        message: `Error while creating roles ${err}`,
      };
      throw error;
    }
  };

  const update = async (id, body) => {
    const validation = updateValidator(body);
    if (validation.error) {
      const error = {
        code: 'role.validation',
        message: validation.error.details,
      };
      throw error;
    }
    try {
      const updatedRole = await db.Role.update(body, {
        where: { id },
        returning: true,
        plain: true,
      });
      return updatedRole[1];
    } catch (err) {
      const error = {
        code: 'role.update',
        message: `Error while updating roles ${err}`,
      };
      throw error;
    }
  };

  const remove = async (id) => {
    try {
      await db.Role.destroy({
        where: { id },
      });
      return { id, deleted: true };
    } catch (err) {
      const error = {
        code: 'roleLike.remove.error',
        message: `Error while removing roles ${err}`,
      };
      throw error;
    }
  };

  return {
    create,
    remove,
    update,
  };
};
