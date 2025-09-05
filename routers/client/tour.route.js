const Router = require('express').Router();

const tourController = require('../../controllers/client/tour.controller')



Router.get('/detail/:slug', tourController.detail);

module.exports = Router;