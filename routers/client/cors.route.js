const Router = require('express').Router()
const corsController = require('../../controllers/client/cors.controller')

Router.get('/insecure', corsController.insecureData)
Router.get('/secure', corsController.secureData)

module.exports = Router
