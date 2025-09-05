const Route = require('express').Router();
const multer = require('multer');
const cloudinaryHelper = require('../../helpers/cloudinary.helper')

const upload = multer({storage: cloudinaryHelper.storage})

const profileController = require('../../controllers/admin/profile.controller');

Route.get("/edit", profileController.edit);
Route.get("/change-password", profileController.changePassword);
Route.patch("/change-password", profileController.changePasswordPatch)
Route.patch("/edit", upload.single("avatar"), profileController.editPatch)
module.exports = Route;