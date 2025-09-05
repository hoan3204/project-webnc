const { default: slugify } = require('slugify');
const Tour = require('../../models/tour.model')
const moment = require('moment')
module.exports.list = async(req , res ) => {

    const find ={
        status:"active",
        deleted:false
    }

    //diem di
    if(req.query.locationFrom){
        find.locations = req.query.locationFrom;
    }
    //end diem di

    //diem den
    if(req.query.locationTo) {
        const keyword = slugify(req.query.locationTo, {
            lower: true
        });
        const keywordRegex = new RegExp(keyword);
        find.slug = keywordRegex;
    }
    //end diem den

    //ngay khoi hanh'
    if(req.query.departureDate){
        const date = new Date(req.query.departureDate);
        find.departureDate = date;
    }
    //end ngay khoi hanh

    //soluong
    //nguoi lon
    if(req.query.stockAdult){
        find.stockAdult = {
            $gte : parseInt(req.query.stockAdult)
        }
    }
    //children
    if(req.query.stockChildren){
        find.stockChildren = {
            $gte : parseInt(req.query.stockChildren)
        }
    }
    //baby
    if(req.query.stockBaby){
        find.stockBaby = {
            $gte : parseInt(req.query.stockBaby)
        }
    }

    //end luong nguoi

    //muc gia
    if(req.query.price){
        const [ priceMin, priceMax]= req.query.price.split("-").map(item => parseInt(item));
        find.priceNewAdult = {
            $gte:priceMin,
            $lte: priceMax
        }
    }

    //end muc gia
    const tourList = await Tour
        .find(find)
        .sort({
            position:"desc"
        })
        for(const item in tourList) {
            item.departureDateFomat = moment(item.departureDate).format("DD/MM/YYYY")
        }
    res.render("client/pages/search", {
        pageTitle: "Kết quả tìm kiếm",
        tourList:tourList
    })
}