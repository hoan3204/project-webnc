const Contact = require("../../models/contact.model")

module.exports.list = async (req,res) => {
    const contactList = Contact.find({})
    res.render('admin/pages/user-list', {
        contactList:contactList,
        pageTitle:"Quản lý người dùng"
    })
}