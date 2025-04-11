const Route = require('express').Router();

const userController = require('../../controllers/admin/user.controller')

Route.get('/list', userController.list);

module.exports = Route;