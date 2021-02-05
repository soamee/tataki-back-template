const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const logger = require('../components/logger')({});

const { DATABASE_LOGGING_ENABLED, ENVIRONMENT } = require('../config');

const databaseConfig = require('./config.json');

let environmentConfig = databaseConfig.development;
if (databaseConfig[ENVIRONMENT]) {
  environmentConfig = databaseConfig[ENVIRONMENT];
}

let databaseLogging = false;
if (DATABASE_LOGGING_ENABLED) {
  // eslint-disable-next-line no-console
  databaseLogging = console.log;
}

const sequelize = new Sequelize(
  environmentConfig.database,
  environmentConfig.username,
  environmentConfig.password,
  {
    host: environmentConfig.host,
    port: environmentConfig.port,
    dialect: environmentConfig.dialect,
    dialectOptions: environmentConfig.dialectOptions || {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: databaseLogging,
  },
);

const db = {};

fs.readdirSync(`${__dirname}/models`)
  .forEach((file) => {
    const model = sequelize.import(`${__dirname}/models/${file}`);
    const fileName = path.basename(file, '.js');
    const modelName = fileName[0].toUpperCase() + fileName.slice(1);
    db[modelName] = model;
  });

/* eslint-disable */
const printAssociationsForModel = modelName => {
  console.log('model -> ', modelName);
  console.log('=======================');
  const model = db[modelName];
  for (const assoc of Object.keys(model.associations)) {
    for (const accessor of Object.keys(model.associations[assoc].accessors)) {
      console.log(
        `${model.name}.${model.associations[assoc].accessors[accessor]}()`
      );
    }
  }
  if (!Object.keys(model.associations).length) {
    console.log('No associations available yet');
  }
  console.log('=======================\n');
};
/* eslint-enable */

const init = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
      printAssociationsForModel(modelName);
    });
  } catch (err) {
    logger.error(`Unable to connect to the database: ${err}`);
  }
};

const stop = async () => sequelize.close();

module.exports = {
  ...db,
  database: sequelize,
  initDatabase: init,
  stop,
};
