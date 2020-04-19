module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {},
  );
  User.associate = (models) => {
    models.User.hasMany(models.Role, {
      as: 'roles',
    });
  };
  return User;
};
