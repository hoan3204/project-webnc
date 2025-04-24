const Route = require('express').Router();
const multer = require('multer');



const categoryController = require('../../controllers/admin/category.controller');

const cloudinaryHelper = require('../../helpers/cloudinary.helper')

const categoryValidate = require("../../validates/admin/category.validate")

const upload = multer({ storage : cloudinaryHelper.storage});

Route.get('/list', categoryController.list);
Route.get('/create', categoryController.create);
Route.post('/create',upload.single('avatar'), categoryValidate.createPost , categoryController.createPost)

Route.get("/edit/:id", categoryController.edit)

Route.patch("/edit/:id", upload.single('avatar'), categoryValidate.createPost, categoryController.editPatch)

Route.patch("/delete/:id", categoryController.deletePatch)

Route.patch("/change-multi", categoryController.changeMultiPatch);
module.exports = Route;