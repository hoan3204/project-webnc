const Contact = require('../../models/contact.model')
const moment = require('moment')
module.exports.list = async (req,res) => {

    const find = {
        deleted: false
    }

    const contactList = await Contact
        .find(find)
        .sort({
            createdAt:"desc"
        });

        for( const item of contactList) {
            item.createdAtFomat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY")
        }
    res.render('admin/pages/contact-list', {
        pageTitle:"Thông tin liên hệ",
        contactList: contactList,
    })
}

module.exports.deletePatch = async (req , res) => {
    try {
        const id = req.params.id;

        await Contact.deleteOne({
            _id: id
        })

        req.flash("success", "xóa thành công!")
        res.json({
            code:"success"
        })
    } catch (error) {
        res.json({
            code:"error",
            message: error
        })
    }
}