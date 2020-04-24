module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'userroles',
    {
      name: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {},
  );
  return Role;
};
