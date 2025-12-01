const Router = require('express').Router();

const tourroute = require('./tour.route')
const homeroute = require('./home.route')
const cartroute = require('./cart.route')
const contactroute = require('./contact.route')
const categoryroute = require('./category.route')
const searchroute = require('./search.route')
const orderRoute = require('./order.route')
const corsRoute = require('./cors.route')

const settingMiddleware = require('../../middlewares/client/setting.middleware')
const categoryMiddleware = require("../../middlewares/client/category.middleware")

Router.use(settingMiddleware.websiteInfo);
Router.use(categoryMiddleware.list);

Router.use('/', homeroute);
Router.use('/tour', tourroute);
Router.use('/cart', cartroute);
Router.use('/contact', contactroute);
Router.use('/category', categoryroute)
Router.use('/search', searchroute);
Router.use('/order', orderRoute);
Router.use('/cors-demo', corsRoute);


module.exports = Router;