const Route = require('express').Router();
const multer = require('multer');
const tourValidate = require('../../validates/admin/tour.validate')

const cloudinaryHelper = require("../../helpers/cloudinary.helper")

const upload = multer({storage : cloudinaryHelper.storage});

const tourController = require('../../controllers/admin/tour.controller');

Route.get('/list',tourController.list);
Route.get('/create', tourController.create);
Route.post('/create', upload.fields([
  {name:"avatar", maxCount:1},
  {name:"images", maxCount:10}
]), tourValidate.createPost,tourController.createPost)

Route.patch('/delete/:id', tourController.deletePatch)

Route.get('/trash', tourController.trash);

Route.patch('/undo/:id', tourController.undoPatch)

Route.patch('/destroy/:id', tourController.destroy)

Route.patch('/trash/change-multi', tourController.trashMulti)

Route.patch('/change-multi', tourController.changeMultiPatch)
Route.get('/edit/:id', tourController.edit)

Route.patch(
  '/edit/:id', 
  upload.fields([
    {name:"avatar", maxCount:1},
    {name:"images", maxCount:10}
  ]), 
  tourValidate.createPost,
  tourController.editPatch
)


module.exports = Route;