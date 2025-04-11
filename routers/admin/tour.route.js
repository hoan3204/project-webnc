const Route = require('express').Router();

const tourController = require('../../controllers/admin/tour.controller');

Route.get('/list',tourController.list);
Route.get('/create', tourController.create);
Route.get('/trash', tourController.trash);

module.exports = Route;