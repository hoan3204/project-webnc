const permissionConfig = require('../../config/permission')
const SettingWebsiteInfo = require('../../models/setting-website-info')
const Role = require('../../models/role.model')
const AccountAdmin = require('../../models/account-admin.model')
const bcrypt = require('bcryptjs')
module.exports.list = async (req,res) => {
    res.render('admin/pages/setting-list', {
        pageTitle:"Cài đặt chung"
    })
}

module.exports.websoteInfo = async (req,res) => {

    const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

    console.log(settingWebsiteInfo);
    res.render('admin/pages/setting-website-info',{
        pageTitle:"Thông tin website",
        settingWebsiteInfo: settingWebsiteInfo,
    })
}

module.exports.websoteInfoPatch = async (req,res) => {
    

    if(req.files && req.files.logo){
        req.body.logo = req.files.logo[0].path;
    } else {
        delete req.body.logo;
    }

    if(req.files && req.files.favicon) {
        req.body.favicon = req.files.favicon[0].path;
    } else {
        delete req.body.favicon;
    }

    const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

    if(settingWebsiteInfo) {
        await SettingWebsiteInfo.updateOne({
            _id: settingWebsiteInfo.id
        }, req.body)
    } else {
        const newRecord = new SettingWebsiteInfo(req.body);
        await newRecord.save();
    }


    req.flash("success", "Cập Nhật Thành Công!");

    res.json({
        code:"success"
    })
}

module.exports.websiteAdminList = async (req,res) => {
    const accountAdminList = await AccountAdmin
        .find({
            deleted:false
        })
        .sort({
            createdAt: "desc"
        })
    for( const item of accountAdminList){
        if(item.role) {
            const roleInfo = await Role.findOne({
                _id: item.role
            })
            if (roleInfo) {
                item.roleName = roleInfo.name;
            }
        }
    }
    res.render('admin/pages/setting-account-admin-list', {
        pageTitle:"Tài khoản quản trị",
        accountAdminList: accountAdminList,
        
    })
}

module.exports.websiteAdminDeletePatch = async (req, res) => {
    try {
        const id = req.params.id;

        await AccountAdmin.deleteOne({
            _id:id
        })
        req.flash("success", "Xóa thành công!");
        res.json({
            code:"success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "id khong hop le!"
        })
    }
}

module.exports.websiteAdminCreate = async (req,res) => {
    const roleList = await Role.find({
        deleted: false
    })
    res.render('admin/pages/setting-account-admin-create', {
        pageTitle:"Tạo tài khoản quản trị",
        roleList:roleList,
    })
}

module.exports.websiteAdminCreatePost = async (req, res) => {

    const existAccount = await AccountAdmin.findOne({
        email: req.body.email
    })
    if(existAccount){
        res.json({
            code:"error",
            message : "Email da ton tai!"
        })
        return;
    }

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    req.body.avatar = req.file ? req.file.path : "";
    //mahoa mk
    const salt = await bcrypt.genSalt(10);//tao10 ky tu ngau nhien
    req.body.password= await bcrypt.hash(req.body.password, salt);

    const newRecord = new AccountAdmin(req.body);
    await newRecord.save();

    req.flash("success", "Tạo tài khoản thành công!")

    res.json({
        code: "success"
    })
}


module.exports.roleList = async (req,res) => {
    const roleList = await Role.find({
        deleted:false,
    })
    
    res.render('admin/pages/setting-role-list', {
        pageTitle:"Nhóm quyền",
        roleList: roleList,
    })
}

module.exports.roleEdit = async (req, res) => {
try {
    
    const id = req.params.id;

    const roleDetail = await Role.findOne({
        _id: id,
        deleted: false 
    })
    res.render('admin/pages/setting-role-edit',{
        pageTitle: "Sửa Nhóm Quyền",
        permissionList: permissionConfig.permissionList,
        roleDetail: roleDetail,
    }
    )
} catch (error) {
    res.redirect(`/${pathadmin}/setting/role/list`)
}
}

module.exports.roleEditPatch = async (req, res) => {
    try {
        
    const id = req.params.id;

    req.body.updatedBy = req.account.id;

    await Role.updateOne({
        _id:id
    }, req.body)

    req.flash("success", "Cập Nhật thành công!")
    res.json({
        code: "success"
    })
    } catch (error) {
        res.json({
            code:"error",
            message: "id không hợp lệ!"
        })
    }
}

module.exports.roleDeletePatch = async (req, res) => {
    try {
        const id = req.params.id;

        await Role.deleteOne({
            _id:id
        })

        req.flash("success", "Xóa vĩnh viễn thành công!");

        res.json({
            code:"success",
        })
    } catch (error) {
        res.json({
            code:"error",
            message: "id không hợp lệ!"
        })
    }
}

module.exports.roleCreate = async (req,res) => {

    res.render('admin/pages/setting-role-create', {
        pageTitle:"Tạo nhóm quyền",
        permissionList:permissionConfig.permissionList
    })
}

module.exports.roleCreatePost = async (req, res) => {

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;

    const newRecord = new Role(req.body);
    await newRecord.save();
    req.flash("success", "Tạo nhóm quyền thành công!");

    res.json({
        code:"success"
    })
}

module.exports.settingWebsiteAdminEdit = async (req, res) => {
    try {
        
    const id = req.params.id;

    const accountAdminDetail = await AccountAdmin.findOne({
        _id: id,
        deleted: false
    })
    if(!accountAdminDetail){
        res.redirect(`/${pathadmin}/website-admin/list`);
        return;
    }

    const roleList = await Role.find({
        deleted: false
    })
    
    res.render('admin/pages/setting-account-admin-edit', {
        pageTitle:"chỉnh sửa tài khoản quản trị",
        roleList: roleList,
        accountAdminDetail: accountAdminDetail
    })
    } catch (error) {
        res.redirect(`/${pathadmin}/website-admin/list`)
    }
}

module.exports.settingWebsiteAdminEditPatch = async (req, res) => {
    try {
        const id = req.params.id;
        req.body.updatedBy = req.account.id;
        if(req.file) {
            req.body.avatar = req.file.path;
        } else {
            delete req.body.avatar;
        }

        if(req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }

        await AccountAdmin.updateOne({
            _id:id,
            deleted: false
        }, req.body)

        req.flash("success", "cập nhật thành công!");
        res.json({
            code: "success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id khong hop le!"
        })
    }
}