module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(
    'userroles',
    [
      {
        userId: 10000,
        name: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 10001,
        name: 'REGULAR',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface) => queryInterface.bulkDelete('userroles', null, {}),
};
