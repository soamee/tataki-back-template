const { User } = require('../../../db');

const delay = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(new Error('timeout'));
  }, 500);
});

const cleanDatabase = async () => {
  await delay();
  await User.destroy({ truncate: { cascade: true } });
};

module.exports = {
  cleanDatabase,
};
