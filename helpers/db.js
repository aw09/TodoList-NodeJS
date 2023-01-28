const Types = require('sequelize')
const dbConfig = require('../config/db.config');

const { Sequelize } = Types;
const {
  username, password, database
} = dbConfig;

const sequelize = new Sequelize(database, username, password, dbConfig);

sequelize
  .authenticate()
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error(err.message))

const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
  console.log(`Error: ${err}`);
});

const cacheMiddleware = (options) => {
  return async (next) => {
    let result;
    const key = JSON.stringify(options);
    const cacheResult = await client.get(key);
    if (cacheResult) {
      result = JSON.parse(cacheResult);
    } else {
      result = await next();
      client.set(key, JSON.stringify(result));
    }
    return result;
  }
}

sequelize.addHook('beforeFind', cacheMiddleware);

module.exports = {
  db: {
    Sequelize,
    Types,
    sequelize,
  }
}