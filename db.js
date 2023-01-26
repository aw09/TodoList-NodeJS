const mysql = require('mysql');
require('dotenv').config()

console.log(process.env)
const createTableTodos = `CREATE TABLE IF NOT EXISTS todos (
    todo_id integer PRIMARY KEY AUTO_INCREMENT,
    activity_group_id integer,
    title text,
    priority text,
    is_active boolean DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`
const createTableActivities = `CREATE TABLE IF NOT EXISTS activities (
    activity_id integer PRIMARY KEY AUTO_INCREMENT,
    title text,
    email varchar(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`
var con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(createTableActivities, [], (err, result) => {
        if (err) throw err;
        else console.log(result);
    });
    con.query(createTableTodos, [], (err, result) => {
        if (err) throw err;
        else console.log(result);
    });
});

const query = async (sql, params = []) => {
    return new Promise((resolve, reject) => {
        con.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}


module.exports = {
    query
}