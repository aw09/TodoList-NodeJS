const cluster = require('cluster');
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3030;

app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/activity-groups", route.activity);
app.use("/todo-items", route.todo);

app.listen(port, () => {
  console.log(`TodoList app listening on port ${port}`);
});
