const { Router } = require('express')
const Activity = require('../models/activity')
const router = new Router()
const { response } = require('../helpers/response')


// ============= Activities =============

const create = (req, res) => {
    const { body } = req

    if (!body.title) {
        return response(res, 400, "title cannot be null")
    }

    const data = {
        title: body.title,
        email: body.email ? body.email : ""
    }

    Activity.create(data)
        .then(data => {
            return response(res, 201, "Success", data)
        })
        .catch(err => {
            return response(res, 400, err.message)
        })
}

const getAll = (req, res) => {
    Activity.findAll()
        .then(data => {
            return response(res, 200, "Success", data)
        })
        .catch(err => {
            return response(res, 400, err.message)
        })
}

const getOne = (req, res) => {
    const id = req.params.id

    Activity.findByPk(id)
        .then(data => {
            if (data) return response(res, 200, "Success", data)
            else return response(res, 404, `Activity with ID ${id} Not Found`)
        })
        .catch(err => {
            return response(res, 400, err.message)
        })
}

const update = async (req, res) => {
    const { body, params } = req
    const { id } = params

    if (!body.title) {
        return response(res, 400, "title cannot be null")
    }

    let currentData = await Activity.findByPk(id)

    if (!currentData) return response(res, 404, `Activity with ID ${id} Not Found`)

    currentData.title = body.title;
    currentData.updated_at = Date.now();

    Activity
        .update(currentData.dataValues, {
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
    const id = req.params.id

    const isAvailable = await Activity.findByPk(id)

    if (!isAvailable) return response(res, 404, `Activity with ID ${id} Not Found`)

    Activity.destroy({
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