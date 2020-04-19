module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(
    'users',
    [
      {
        firstName: 'Javier',
        lastName: 'Manzano',
        email: 'jmanzano@soamee.com',
        password:
            '$2b$10$9PGHPPwwWV.wa0uGiOVCReAONvawL4AMy4TfNaSVZHi2Dq6jJnmCm', // 12341234
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Irene',
        lastName: 'Mateo',
        email: 'imateo@soamee.com',
        password:
            '$2b$10$9PGHPPwwWV.wa0uGiOVCReAONvawL4AMy4TfNaSVZHi2Dq6jJnmCm', // 12341234
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
