const Sequelize = require('sequelize');
const logger = require('../components/logger')({});

const { DATABASE_LOGGING_ENABLED, ENVIRONMENT } = require('../config');

const databaseConfig = require('./config.json');

let environmentConfig = databaseConfig.development;
if (databaseConfig[ENVIRONMENT]) {
  environmentConfig = databaseConfig[ENVIRONMENT];
}

const sequelize = new Sequelize(
  environmentConfig.database,
  environmentConfig.username,
  environmentConfig.password,
  {
    host: environmentConfig.host,
    port: environmentConfig.port,
    dialect: environmentConfig.dialect,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: DATABASE_LOGGING_ENABLED,
  },
);

const db = {
  User: sequelize.import('./models/user'),
  Role: sequelize.import('./models/role'),
};

const init = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
  } catch (err) {
    logger.error(`Unable to connect to the database: ${err}`);
  }
};

const stop = async () => sequelize.close();

module.exports = {
  ...db,
  database: sequelize,
  init,
  stop,
};
