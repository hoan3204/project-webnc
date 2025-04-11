const Route = require('express').Router();

const orderController = require('../../controllers/admin/order.controller');

Route.get("/list", orderController.list);
Route.get("/edit", orderController.edit);

module.exports = Route;