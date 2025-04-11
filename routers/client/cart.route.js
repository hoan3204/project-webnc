const Router = require('express').Router();

const cartController = require("../../controllers/client/cart.controller");

Router.get("/list", cartController.list);

module.exports = Router;