const Router = require('express').Router();

const homeController = require('../../controllers/client/home.controller');

Router.get('/', homeController.home);

module.exports = Router;