require('dotenv').config()

module.exports = {
    host: process.env.MYSQL_HOST || "localhost",
    username: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DBNAME || "todolist",
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql'
};