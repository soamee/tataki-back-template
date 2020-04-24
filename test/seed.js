const { exec } = require('child_process');

module.exports = async () => {
  await new Promise((resolve, reject) => {
    exec('npm run db:seed:test', {}, (err) => (err ? reject(err) : resolve()));
  });
};
