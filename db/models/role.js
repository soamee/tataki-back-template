module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'roles',
    {
      name: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {},
  );
  Role.associate = (models) => {
    models.Role.belongsTo(models.User, {
      onDelete: 'CASCADE',
    });
  };
  return Role;
};
