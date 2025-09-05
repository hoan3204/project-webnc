const Route = require('express').Router();

const contactController = require('../../controllers/admin/contact.controller');

Route.get("/list", contactController.list);
Route.patch("/delete/:id", contactController.deletePatch)

module.exports = Route;