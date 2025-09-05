const Contact = require('../../models/contact.model')
module.exports.createPost = async (req , res ) => {
    
    const {email} = req.body;

    const exisEmail = await Contact.findOne({
        email: email
    })

    if(exisEmail) {
        res.json({
            code:"error",
            message: "Email đã được đăng ký!"
        })
        return;
    }
    const newRecord = new Contact(req.body);

    await newRecord.save();

    req.flash("success", "Cảm Ơn bạn đã đăng ký nhận tin tức!")
    res.json({
        code: "success"
    })
}