const mysql = require('mysql');
require('dotenv').config()

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
});

const query = async (sql, params = []) => {
    return new Promise((resolve, reject) => {
        con.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

const select = async (sql, params = []) => {
    return new Promise((resolve, reject) => {
        con.query(sql, params, (err, result, fields) => {
            if (err) reject(err);
            else resolve(fields);
        });
    });
}


module.exports = {
    query,
    select
}