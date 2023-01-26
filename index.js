const express = require('express')
const bodyParser = require('body-parser');
const db = require('./db')
const url = require('url')

const app = express()
const port = 3030

app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ============= Activities =============

const activityObject = (data) => {
  return {
    "id": data.activity_id,
    "title": data.title,
    "email": data.email,
    "createdAt": data.created_at,
    "updatedAt": data.updated_at,
  }
}

const activityNotFound = (req, res) => {
  res.status(404).send({
    "status": "Not Found",
    "message": `Activity with ID ${req.params.id} Not Found`,
    "data": {}
  })
}

// Create
app.post('/activity-groups', async (req, res) => {
  const title = req.body.title;
  const email = req.body.email;

  if (title) {
    let sql = "INSERT INTO activities (title, email) VALUES (?, ?)";
    const values = [title, email]
    const result = await db.query(sql, values)
    console.log(result);
    sql = 'SELECT * FROM activities WHERE activity_id = ?'
    const row = (await db.query(sql, [result.insertId]))[0]
    console.log(row[0]);
    res.send({
      "status": "Success",
      "message": "Success",
      "data": activityObject(row)
    })
  } else {
    res.status(400).send({
      "status": "Bad Request",
      "message": "title cannot be null",
      "data": {}
    });
  }
})

// Read
app.get('/activity-groups', async (req, res) => {
    sql = 'SELECT * FROM activities'
    const result = await db.query(sql)
    
    res.send({
      "status": "Success",
      "message": "Success",
      "data": result.map((row) => activityObject(row))
    })
})

app.get('/activity-groups/:id', async (req, res) => {
  sql = 'SELECT * FROM activities WHERE activity_id = ?'
  const result = await db.query(sql, [req.params.id])

  if (result.length == 0) {
    activityNotFound(req, res);
  }
  else {
    res.send({
      "status": "Success",
      "message": "Success",
      "data": activityObject(result[0])
    })
  }
})

// Update
app.patch('/activity-groups/:id', async (req, res) => {
  const title = req.body.title;
  let sql = "SELECT * FROM activities WHERE activity_id = ?";
  let row = await db.query(sql, [req.params.id])

  if (row.length == 0) {
    activityNotFound(req, res);
  }

  if (title) {
    sql = 'UPDATE activities SET title = ? WHERE activity_id = ?'
    const result = await db.query(sql, [title, req.params.id])

    sql = 'SELECT * FROM activities WHERE activity_id = ?'
    row = (await db.query(sql, [req.params.id]))[0]
    console.log(row);
    res.send({
      "status": "Success",
      "message": "Success",
      "data": activityObject(row)
    })
  } else {
    res.status(400).send({
      "status": "Bad Request",
      "message": "title cannot be null",
      "data": {}
    });
  }
})

// DELETE
app.delete('/activity-groups/:id', async (req, res) => {
  let sql = "DELETE FROM activities WHERE activity_id = ?";
  const result = await db.query(sql, [req.params.id])
  if (result.affectedRows != 0) {
    res.send({
      "status": "Success",
      "message": "Success",
      "data": {}
    })
  }
  else {
    activityNotFound(req, res);
  }
})



// ============= Todos =============


const todoObject = (data) => {
  return {
    "id": data.todo_id,
    "activity_group_id": data.activity_group_id,
    "title": data.title,
    "priority": data.priority,
    "is_active": data.is_active == 1 ? true : false,
    "created_at": data.created_at,
    "updated_at": data.updated_at,
  }
}

const todoNotFound = (req, res) => {
  res.status(404).send({
    "status": "Not Found",
    "message": `Todo with ID ${req.params.id} Not Found`,
    "data": {}
  })
}

// Create
app.post('/todo-items', async (req, res) => {
  const title = req.body.title;
  const groupId = parseInt(req.body.activity_group_id);
  const priority = req.body.priority || "very-high";
  const isActive = req.body.is_active;
  console.log(req.body);
  

  if (title && groupId) {
    const param = [title, groupId, priority]
    let sqlColumn = 'title, activity_group_id, priority'
    let sqlValues = '?, ?, ?'

    if(typeof isActive != 'undefined'){
      sqlColumn = sqlColumn.concat(', is_active');
      sqlValues = sqlValues.concat(', ?');
      param.push(isActive);
    }

    let sql = `INSERT INTO todos (${sqlColumn}) VALUES(${sqlValues})`

    const result = await db.query(sql, param)

    sql = 'SELECT * FROM todos WHERE todo_id = ?'
    const row = (await db.query(sql, [result.insertId]))[0]

    res.send({
      "status": "Success",
      "message": "Success",
      "data": todoObject(row)
    })
  } else {
    const missing = !title ? "title" : "activity_group_id"
    res.status(400).send({
      "status": "Bad Request",
      "message": `${missing} cannot be null`,
      "data": {}
    });
  }
})

// Read
app.get('/todo-items', async (req, res) => {
  const groupId = url.parse(req.url,true).query.activity_group_id;
  console.log(groupId)

  let sql = 'SELECT * FROM todos'
  let values = []
  if(groupId){
    sql = sql.concat(' WHERE activity_group_id = ?')
    values = [groupId]
  } 
  
  const result = await db.query(sql, values)

  res.send({
    "status": "Success",
    "message": "Success",
    "data": result.map((row) => todoObject(row))
  })
})

app.get('/todo-items/:id', async (req, res) => {
  sql = 'SELECT * FROM todos WHERE todo_id = ?'
  const result = await db.query(sql, [req.params.id])

  if (result.length == 0) {
    todoNotFound(req, res);
  }
  else {
    res.send({
      "status": "Success",
      "message": "Success",
      "data": todoObject(result[0])
    })
  }
})

// Update
app.patch('/todo-items/:id', async (req, res) => {
  const title = req.body.title;
  const priority = req.body.priority;
  const groupId = req.body.activity_group_id;
  const isActive = req.body.is_active;

  let sql = "SELECT * FROM todos WHERE todo_id = ?";
  let row = await db.query(sql, [req.params.id])

  if (row.length == 0) {
    todoNotFound(req, res);
  }


  try {
    sql = 'UPDATE todos SET '
    let params = []
    if (title) {
      sql = sql.concat('title = ? ')
      params.push(title)
    }

    if (priority) {
      sql = sql.concat('priority = ? ');
      params.push(priority);
    }

    if (groupId) {
      sql = sql.concat('activity_group_id = ? ');
      params.push(groupId);
    }

    if (isActive) {
      sql = sql.concat('is_active = ? ');
      params.push(isActive)
    }
    sql = sql.concat('WHERE todo_id = ?')
    params.push(req.params.id)

    const result = await db.query(sql, params)
    console.log(result);
  } catch (error) {
    console.log(error);
  }

  sql = 'SELECT * FROM todos WHERE todo_id = ?'
  row = (await db.query(sql, [req.params.id]))[0]
  console.log(row);
  res.send({
    "status": "Success",
    "message": "Success",
    "data": todoObject(row)
  })
})

// DELETE
app.delete('/todo-items/:id', async (req, res) => {
  let sql = "DELETE FROM todos WHERE todo_id = ?";
  const result = await db.query(sql, [req.params.id])
  if (result.affectedRows != 0) {
    res.send({
      "status": "Success",
      "message": "Success",
      "data": {}
    })
  }
  else {
    todoNotFound(req, res);
  }
})


app.listen(port, () => {
  console.log(`TodoList app listening on port ${port}`)
})