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

module.exports = {
  db: {
    Sequelize,
    Types,
    sequelize,
  }
}