const Router = require('express').Router();

const contactController = require('../../controllers/client/contact.controller')

Router.post('/create', contactController.createPost )

module.exports = Router;