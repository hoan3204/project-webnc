module.exports.list = async (req,res) => {
    res.render('admin/pages/setting-list', {
        pageTitle:"Cài đặt chung"
    })
}

module.exports.websoteInfo = async (req,res) => {
    res.render('admin/pages/setting-website-info',{
        pageTitle:"Thông tin website"
    })
}

module.exports.websiteAdminList = async (req,res) => {
    res.render('admin/pages/setting-account-admin-list', {
        pageTitle:"Tài khoản quản trị"
    })
}

module.exports.websiteAdminCreate = async (req,res) => {
    res.render('admin/pages/setting-account-admin-create', {
        pageTitle:"Tạo tài khoản quản trị"
    })
}

module.exports.roleList = async (req,res) => {
    res.render('admin/pages/setting-role-list', {
        pageTitle:"Nhóm quyền"
    })
}

module.exports.roleCreate = async (req,res) => {
    res.render('admin/pages/setting-role-create', {
        pageTitle:"Tạo nhóm quyền"
    })
}