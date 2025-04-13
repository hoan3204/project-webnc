const Route = require('express').Router();

const accountController = require('../../controllers/admin/account.controller');
const accountValidate = require('../../validates/admin/account.validate')
const authMiddleware = require('../../middlewares/admin/auth.middleware')

Route.get("/login", accountController.login);
Route.post("/login", accountValidate.loginPost, accountController.loginPost)


Route.get('/forgot-password',accountController.forgotPassword)
Route.post('/forgot-password',accountController.forgotPasswordPOST)

Route.get('/register', accountController.register)
Route.post('/register', accountValidate.registerPost, accountController.registerPost)
Route.get('/register-initial', accountController.registerInitial)




Route.get('/otp-password',accountController.otpPassword)
Route.post('/otp-password', accountController.otpPasswordPost)

Route.get('/reset-password', accountController.resetPassword)
Route.post('/reset-password', authMiddleware.verifyToken, accountController.resetPasswordPost)

Route.post('/logout', accountController.logoutPOST)

module.exports = Route;