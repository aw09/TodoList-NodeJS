const express = require('express')
const mysql = require('mysql');

const app = express()
const port = 3030

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "passwd"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})