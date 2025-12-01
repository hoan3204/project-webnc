const Router = require('express').Router()
const corsController = require('../../controllers/client/cors.controller')

Router.get('/insecure-data', corsController.insecureData)
Router.get('/secure-data', corsController.secureData)
Router.get('/config', corsController.getConfig)

module.exports = Router
