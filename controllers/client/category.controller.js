const Category = require('../../models/category.model')
const Tour = require("../../models/tour.model")
const moment= require('moment')
const city = require('../../models/city.model')
const categoryHelper = require('../../helpers/category.helper')
module.exports.list = async (req , res ) => {


    const slug = req.params.slug;

    const category = await Category.findOne({
        slug:slug,
        deleted:false,
        status:"active"
    })


    if(category) {
        
        const breadcrumb = {
            image:category.avatar,
            title: category.name,
            list : [
                {
                    link:"/",
                    title:"Trang chủ"
                }
            ]
        }

        if(category.parent){
            const parentCategory = await Category.findOne({
                _id: category.parent,
                deleted:false,
                status:"active"
            })

            
            if(parentCategory) {
                breadcrumb.list.push({
                    link:`/category/${parentCategory.slug}`,
                    title: parentCategory.name
                })
            }
        }

        breadcrumb.list.push({
            link:`/category/${category.slug}`,
            title:category.name
        })
    
    //ds tour
  const listCategoryId = await categoryHelper.getAllSubcategoryIds(category.id);
        const find= {
      category:{ $in: listCategoryId},
      deleted:false,
      status:"active"
    }
  const totalTour = await Tour.countDocuments();


  const tourList= await Tour
    .find(find)
    .sort({
      position:"desc"
    })
  
  for(const item of tourList){
    item.departureDateFomat = moment(item.departureDate).format("DD/MM/YYYY");
  }
  //end ds

  const cityList = await city.find({});
    res.render("client/pages/tour-list", {
        pageTitle: "Danh sach tour",
        breadcrumb:breadcrumb,
        category:category,
        tourList: tourList,
        totalTour: totalTour,
        cityList:cityList
    })
    } else {
        res.redirect("/")
    }
}