const Order = require('../../models/order.model')


module.exports.createPost = async (req , res ) => {
  
    const newRecord = new Order(req.body)

    await newRecord.save();

    req.flash("success", "Đặt hàng thành công!")
    res.json({
        code:"success"
    })
}