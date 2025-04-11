const Route = require('express').Router();

const categoryController = require('../../controllers/admin/category.controller');


Route.get('/list', categoryController.list);
Route.get('/create', categoryController.create);

module.exports = Route;