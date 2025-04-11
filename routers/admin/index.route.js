const Route = require('express').Router();

const accountRoute = require('./account.route');
const dashBoardRoute = require('./dashboard.route');
const categoryRoute = require('./category.route');
const tourRoute = require('./tour.route');
const orderRoute = require('./order.route');
const userRoute = require('./user.route');
const contactRoute = require('./contact.route');
const settingRoute = require('./setting.route');
const profileRoute = require('./profile.route');
const authMiddleware = require('../../middlewares/admin/auth.middleware')


Route.use("/account", accountRoute);
Route.use("/dashboard", authMiddleware.verifyToken, dashBoardRoute);
Route.use("/category", authMiddleware.verifyToken, categoryRoute);
Route.use("/tour",authMiddleware.verifyToken, tourRoute);
Route.use("/order", authMiddleware.verifyToken, orderRoute);
Route.use("/user", authMiddleware.verifyToken, userRoute);
Route.use("/contact", authMiddleware.verifyToken, contactRoute);
Route.use("/setting", authMiddleware.verifyToken, settingRoute);
Route.use("/profile",authMiddleware.verifyToken, profileRoute);

Route.get("*", authMiddleware.verifyToken,(req,res) => {
    res.render('admin/pages/error-404', {
        pageTitle:"404 Not Found"
    })
})


module.exports = Route;