const Route = require('express').Router();
const multer = require('multer')


const cloudinaryHelper = require("../../helpers/cloudinary.helper")

const upload = multer({storage : cloudinaryHelper.storage});

const settingController = require('../../controllers/admin/setting.controller');

Route.get("/list", settingController.list);
Route.get("/website-info",settingController.websoteInfo);

Route.patch(
    "/website-info",
    upload.fields(
        [
        {name:'logo', maxCount: 1},
        {name: 'favicon', maxCount: 1}
        ]
    ),
    settingController.websoteInfoPatch
);

Route.get("/website-admin/list", settingController.websiteAdminList);
Route.get("/website-admin/create", settingController.websiteAdminCreate);

Route.post("/website-admin/create", upload.single("avatar"),settingController.websiteAdminCreatePost);

Route.get("/website-admin/edit/:id", settingController.settingWebsiteAdminEdit)

Route.patch("/website-admin/edit/:id", upload.single("avatar"),settingController.settingWebsiteAdminEditPatch)

Route.patch(`/website-admin/delete/:id`, settingController.websiteAdminDeletePatch)

Route.get("/role/list", settingController.roleList);

Route.get("/role/edit/:id", settingController.roleEdit)
Route.patch("/role/edit/:id", settingController.roleEditPatch)
Route.patch("/role/delete/:id", settingController.roleDeletePatch)

Route.get("/role/create", settingController.roleCreate);
Route.post("/role/create", settingController.roleCreatePost);

module.exports = Route;