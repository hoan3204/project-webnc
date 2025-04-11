const Router = require('express').Router();

const tourController = require('../../controllers/client/tour.controller')


Router.get('/', tourController.list);
Router.get('/detail', tourController.detail);

module.exports = Router;