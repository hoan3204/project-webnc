const Category = require('../../models/category.model');
const Tour = require('../../models/tour.model')
const moment = require('moment')
const city = require('../../models/city.model')
module.exports.detail = async (req, res) => {
 const slug = req.params.slug;

  // Tìm tour theo slug
  const tourDetail = await Tour.findOne({
    slug: slug,
    status: "active",
    deleted: false
  })

  if(tourDetail) {
    // Breadcrumb
    const breadcrumb = {
      image: tourDetail.avatar,
      title: tourDetail.name,
      list: [
        {
          link: "/",
          title: "Trang Chủ"
        }
      ]
    };

    const category = await Category.findOne({
      _id: tourDetail.category,
      deleted: false,
      status: "active"
    })

    if(category) {
      // Tìm danh mục cha
      if(category.parent) {
        const parentCategory = await Category.findOne({
          _id: category.parent,
          deleted: false,
          status: "active"
        })

        if(parentCategory) {
          breadcrumb.list.push({
            link: `/category/${parentCategory.slug}`,
            title: parentCategory.name
          })
        }
      }

      // Thêm danh mục hiện tại
      breadcrumb.list.push({
        link: `/category/${category.slug}`,
        title: category.name,
      })
    }

    breadcrumb.list.push({
      link: `/tour/detail/${slug}`,
      title: tourDetail.name
    });
    // End Breadcrumb

    ///thong tin chi tiet
    tourDetail.departureDateFomat = moment(tourDetail.departureDate).format("DD/MM/YYYY")
    //end thong tin chi tiet

    const cityList = await city.find({
      _id: {$in: tourDetail.locations}
    })

    res.render("client/pages/tour-detail", {
      pageTitle: "Chi tiết tour",
      breadcrumb: breadcrumb,
      tourDetail:tourDetail,
      cityList:cityList
    })
  } else {
    res.redirect("/");
  }
}