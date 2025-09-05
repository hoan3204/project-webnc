const Tour = require("../../models/tour.model")
const moment = require("moment")
const categoryHelper = require("../../helpers/category.helper")
module.exports.home =async (req, res) => {
  
  //sec2
  const tourListSection2 = await Tour
    .find({
      deleted:false,
      status:"active"
    })
    .sort({
      position:"desc"
    })
    .limit(6)

  for(const item of tourListSection2){
    item.departureDateFomat = moment(item.departureDate).format("DD/MM/YYYY");
  }

  //end sec2

  //sec4
  const categoryIdSection4 = "68235371d22e3941d1b570d5" // id danh muc tour trong nuoc
  const listCategoryId = await categoryHelper.getAllSubcategoryIds(categoryIdSection4);

  
  const tourListSection4 = await Tour
    .find({
      category:{ $in: listCategoryId},
      deleted:false,
      status:"active"
    })
    .sort({
      position:"desc"
    })
    .limit(8)
  
  for(const item of tourListSection4){
    item.departureDateFomat = moment(item.departureDate).format("DD/MM/YYYY");
  }
  //end sec4
  res.render("client/pages/home",{
    pageTitle:"trang chu",
    tourListSection2: tourListSection2,
    tourListSection4: tourListSection4,
  });
}