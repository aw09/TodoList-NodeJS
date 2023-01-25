const express = require('express')
const bodyParser = require('body-parser');
const db = require('./db')

const app = express()
const port = 3030

app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




// ============= Activities =============

const createActivity = (data) => {
  return {
    "created_at": data.created_at,
    "updated_at": data.updated_at,
    "id": data.activity_id,
    "title": data.title,
    "email": data.email
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
      "data": createActivity(row)
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
      "data": result.map((row) => createActivity(row))
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
      "data": createActivity(result[0])
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
      "data": createActivity(row)
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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})