const Order = require('../../models/order.model')
const Tour = require('../../models/tour.model')
const moment = require('moment');
module.exports.list = async (req,res) => {

    const orderList = await Order.find({});
 
    
    // Tính tổng tiền cho từng đơn hàng
    orderList.forEach(order => {
        let total = 0;
        order.cart.forEach(cart => {
            total += 
                (cart.quantityAdult || 0) * (cart.priceNewAdult || 0) +
                (cart.quantityChildren || 0) * (cart.priceNewChildren || 0) +
                (cart.quantityBaby || 0) * (cart.priceNewBaby || 0);
        });

        order.total = total;

        
        // Format ngày đặt
        order.createdTime = moment(order.createdAt).format('HH:mm');
        order.createdDate = moment(order.createdAt).format('DD/MM/YYYY');
    });



    
    res.render('admin/pages/order-list', {
        pageTitle:"Quản lý đơn hàng",
        orderList:orderList,
    })
}

module.exports.edit = async (req, res) => {
    const id = req.params.id;

    const orderDetail = await Order.findOne({
        _id: id,
        deleted: false,
    });

    // Tính tổng tiền cho đơn hàng
    let total = 0;
    orderDetail.cart.forEach(cart => {
        total += 
            (cart.quantityAdult || 0) * (cart.priceNewAdult || 0) +
            (cart.quantityChildren || 0) * (cart.priceNewChildren || 0) +
            (cart.quantityBaby || 0) * (cart.priceNewBaby || 0);
    });
    orderDetail.total = total;

    // Format ngày đặt
    orderDetail.createdTime = moment(orderDetail.createdAt).format('HH:mm');
    orderDetail.createdDate = moment(orderDetail.createdAt).format('DD/MM/YYYY');
    orderDetail.createdFull = moment(orderDetail.createdAt).format('DD/MM/YYYY HH:mm A');

    res.render('admin/pages/order-edit', {
        pageTitle: "Đơn hàng: OD000001",
        orderDetail: orderDetail
    });
}

module.exports.deletePatch = async (req , res ) => {
    const id = req.params.id;

    await Order.deleteOne({
        _id:id,
    })
    req.flash("success", "Xóa thành công!")
    res.json({
        code:"success"
    })
}