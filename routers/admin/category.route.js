const Route = require('express').Router();
const multer = require('multer');
const upload = multer();


const categoryController = require('../../controllers/admin/category.controller');


Route.get('/list', categoryController.list);
Route.get('/create', categoryController.create);
Route.post('/create',upload.single('avatar') , categoryController.createPost)

module.exports = Route;