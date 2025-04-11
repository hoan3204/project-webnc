const Route = require('express').Router();

const accountController = require('../../controllers/admin/account.controller');
const accountValidate = require('../../validates/admin/account.validate')

Route.get("/login", accountController.login);
Route.post("/login", accountValidate.loginPost, accountController.loginPost)


Route.get('/forgot-password',accountController.forgotPassword)

Route.get('/register', accountController.register)
Route.post('/register', accountValidate.registerPost, accountController.registerPost)
Route.get('/register-initial', accountController.registerInitial)




Route.get('/otp-password',accountController.otpPassword)
Route.get('/reset-password', accountController.resetPassword)

Route.post('/logout', accountController.logoutPOST)

module.exports = Route;