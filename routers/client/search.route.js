const Route = require('express').Router();

const searchController = require('../../controllers/client/search.controller')

Route.get("/", searchController.list);

module.exports = Route;