module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(
    'roles',
    [
      {
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface) => queryInterface.bulkDelete('roles', null, {}),
};
