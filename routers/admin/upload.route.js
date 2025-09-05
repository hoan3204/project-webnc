const Route = require('express').Router();
const multe = require('multer')

const cloudinaryHelper = require('../../helpers/cloudinary.helper')

const uploadController = require('../../controllers/admin/upload.controller')

const upload = multe({ storage: cloudinaryHelper.storage});

Route.post('/image', upload.single("file"),uploadController.imagePost)

module.exports = Route;