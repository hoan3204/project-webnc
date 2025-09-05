const Router = require('express').Router();

const cartController = require("../../controllers/client/cart.controller");

Router.get("/", cartController.list);

Router.post("/detail", cartController.detail)

module.exports = Router;