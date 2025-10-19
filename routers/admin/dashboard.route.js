const Route = require('express').Router();

const dashBoardController = require('../../controllers/admin/dashboard.controller')

Route.get('/', dashBoardController.dashboard);

Route.post('/revenue-chart', dashBoardController.revenueChartPost)

module.exports = Route;