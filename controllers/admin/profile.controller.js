const AccountAdmin = require("../../models/account-admin.model");
const bcrypt = require('bcryptjs')
module.exports.edit = async (req,res) => {

    
    res.render('admin/pages/profile-edit', {
        pageTitle:"Thông tin cá nhân",
    })
}

module.exports.editPatch = async (req,res) => {
    try {
        const id = req.account.id;

        req.body.updatedBy = req.account.id;

        if(req.file){
            req.body.avatar = req.file.path;
        } else {
            delete req.body.avatar;
        }

        await AccountAdmin.updateOne({
            _id: id,
            deleted: false
        }, req.body);

        req.flash("success", "Cập nhật thành công!")
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

module.exports.changePassword = async (req,res) => {
    res.render('admin/pages/profile-change-password', {
        pageTitle:"Đổi mật khẩu"
    })
}

module.exports.changePasswordPatch = async (req,res) => {
    try {
        const id = req.account.id;

        req.body.updatedBy = id;

        const salt =  await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);

        console.log(req.body);
        await AccountAdmin.updateOne({
            _id:id,
            deleted:false
        }, req.body)

        req.flash("success", "Đổi mật khẩu thành công!")
        res.json({
            code: "success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "id khong hop le!"
        })
    }
}

