const Route = require('express').Router();

const orderController = require('../../controllers/client/order.controller')

Route.post('/create', orderController.createPost)



module.exports = Route;