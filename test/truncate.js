const db = require('../db');

module.exports = async () => {
  await db.User.destroy({ where: {} });
  await db.Role.destroy({ where: {} });
};
