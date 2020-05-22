module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM,
        values: ['REGULAR', 'ADMIN'],
        defaultValue: 'REGULAR',
      },
    },
    {
      paranoid: true,
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
    },
  );
  return User;
};
