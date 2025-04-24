const Route = require('express').Router();
const multer = require('multer');



const categoryController = require('../../controllers/admin/category.controller');

const cloudinaryHelper = require('../../helpers/cloudinary.helper')
const upload = multer({ storage : cloudinaryHelper.storage});

Route.get('/list', categoryController.list);
Route.get('/create', categoryController.create);
Route.post('/create',upload.single('avatar') , categoryController.createPost)

module.exports = Route;