const Route = require('express').Router();

const orderController = require('../../controllers/admin/order.controller');

Route.get("/list", orderController.list);

Route.get("/edit/:id", orderController.edit);

Route.patch("/edit/:id", orderController.editPatch)

module.exports = Route;