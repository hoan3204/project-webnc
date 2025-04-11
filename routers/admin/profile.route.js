const Route = require('express').Router();

const profileController = require('../../controllers/admin/profile.controller');

Route.get("/edit", profileController.edit);
Route.get("/change-password", profileController.changePassword);

module.exports = Route;