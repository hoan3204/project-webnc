const Router = require('express').Router();

const tourroute = require('./tour.route')
const homeroute = require('./home.route')
const cartroute = require('./cart.route')

Router.use('/', homeroute);
Router.use('/tours', tourroute);
Router.use('/cart', cartroute);


module.exports = Router;