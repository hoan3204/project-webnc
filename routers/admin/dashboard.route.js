const Route = require('express').Router();

const dashBoardController = require('../../controllers/admin/dashboard.controller')

Route.get('/', dashBoardController.dashboard);

module.exports = Route;