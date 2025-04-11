const Route = require('express').Router();

const settingController = require('../../controllers/admin/setting.controller');

Route.get("/list", settingController.list);
Route.get("/website-info",settingController.websoteInfo);
Route.get("/website-admin/list", settingController.websiteAdminList);
Route.get("/website-admin/create", settingController.websiteAdminCreate);
Route.get("/role/list", settingController.roleList);
Route.get("/role/create", settingController.roleCreate);

module.exports = Route;