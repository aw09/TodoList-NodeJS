
const Todo = require('../models/todo');
const Activity = require('../models/activity');
const { response } = require('../helpers/response')
const { Router } = require('express')


const router = new Router()


const create = async (req, res) => {
  const { body } = req;
  
  if (!body.activity_group_id) {
    return response(res, 400, "activity_group_id cannot be null")
  }

  if (!body.title) {
    return response(res, 400, "title cannot be null")
  }

  const currentActivity = await Activity.findByPk(body.activity_group_id)

  if (!currentActivity) return response(res, 404, `Activity with activity_group_id ${body.activity_group_id} Not Found`)

  const data = {
    title: body.title,
    activity_group_id: body.activity_group_id,
    is_active: body.is_active ? body.is_active : true,
    priority: body.priority ? body.priority : "very-high"
  }
  
  Todo.create(data)
    .then(data => {
      return response(res, 201, "Success", data)
    })
    .catch(err => {
      return response(res, 400, err.message)
    })
}

const getAll = (req, res) => {
  const { activity_group_id } = req.query;

  let query = {}

  if (activity_group_id) query.activity_group_id = activity_group_id;
  
  Todo.findAll({
    where: query
  })
    .then(data => {
      return response(res, 200, "Success", data)
    })
    .catch(err => {
      return response(res, 400, err.message)
    })
}

const getOne = (req, res) => {
  const id = req.params.id;

  Todo.findByPk(id)
    .then(data => {
      if (data) return response(res, 200, "Success", data)
      else return response(res, 404, `Todo with ID ${id} Not Found`)
    })
    .catch(err => {
      return response(res, 400, err.message)
    })
}

const update = async (req, res) => {
  const { body, params } = req;
  const { id } = params;
  
  let currentData = await Todo.findByPk(id)

  if (!currentData) return response(res, 404, `Todo with ID ${id} Not Found`)

  currentData.title = body.title ? body.title : currentData.title;
  currentData.is_active = body.is_active ? body.is_active : currentData.is_active;
  currentData.priority = body.priority ? body.priority : currentData.priority;
  currentData.updated_at = Date.now();

  Todo.update(currentData.dataValues, {
    where: {
      id: id
    }
  })
    .then(data => {
      return response(res, 200, "Success", currentData)
    })
    .catch(err => {
      return response(res, 400, err.message)
    })
}

const deleteData = async (req, res) => {
  const id = req.params.id;

  let currentData = await Todo.findByPk(id)

  if (!currentData) return response(res, 404, `Todo with ID ${id} Not Found`)

  Todo.destroy({
    where: {
      id: id
    }
  })
    .then(data => {
      return response(res, 200, "Success", {})
    })
    .catch(err => {
      return response(res, 400, err.message)
    })
}

router.get('/', getAll);
router.get('/:id', getOne)
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', deleteData);

module.exports = router;