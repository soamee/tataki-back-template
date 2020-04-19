const { exec } = require('child_process');

module.exports = async () => {
  await new Promise((resolve, reject) => {
    const migrate = exec('npm run db:seed:test', {}, (err) => (err ? reject(err) : resolve()));
    migrate.stdout.pipe(process.stdout);
    migrate.stderr.pipe(process.stderr);
  });
};
