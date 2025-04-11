const Route = require('express').Router();

const contactController = require('../../controllers/admin/contact.controller');

Route.get("/list", contactController.list);

module.exports = Route;