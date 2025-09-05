const Route = require('express').Router();

const categoryController = require('../../controllers/client/category.controller')

Route.get('/:slug', categoryController.list);

module.exports = Route;