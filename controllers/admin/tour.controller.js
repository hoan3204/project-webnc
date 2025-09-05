const categoryHelper = require('../../helpers/category.helper')
const Category = require('../../models/category.model')
const City = require('../../models/city.model')
const Tour = require('../../models/tour.model')
const AccountAdmin = require('../../models/account-admin.model')
const moment = require('moment')
const slugify = require('slugify')


module.exports.list = async (req,res) => {

    const find = {
        deleted : false,
    };

    if(req.query.status) {
        find.status = req.query.status;
    }

    const accountAdminList = await AccountAdmin
        .find({})
        .select("fullName")

    if(req.query.createdBy) {
        find.createdBy = req.query.createdBy;
    }

    if (req.query.categories){
        find.category = req.query.categories;
    }
    const dataFilter = {};
    if(req.query.startDate){
        const startDate = moment(req.query.startDate).startOf("date").toDate();
        dataFilter.$gte = startDate;
    }

    if (req.query.endDate) {
        const endDate = moment(req.query.endDate).endOf("date").toDate();
        dataFilter.$lte = endDate;
    }

    if(Object.keys(dataFilter).length > 0) {
        find.createdAt = dataFilter;
    }


    const categoryList = await Category.find({
        deleted: false,
    })

    const categoryTree = categoryHelper.buildCategoryTree(categoryList);

    //tim kiem
        if(req.query.keyword) {
            const keyword = slugify(req.query.keyword, {
                lower: true
            });
    
            const keywordRegex = new RegExp(keyword);
            find.slug = keywordRegex;
        }
    
        //end tim kiem

    //phan trang
    const limitItem = 5
    let page = 1;
    if(req.query.page) {
        const currentPage = parseInt(req.query.page);
        if(currentPage > 0) {
            page = currentPage;
        } 
    }
    const totalRecord = await Tour.countDocuments(find);
    const totalPage = Math.ceil(totalRecord/limitItem);
    if(page > totalPage) {
        page = totalPage
    }
    const skip = Math.max(0, (page - 1) * limitItem);

    
    const pagination = {
        skip: skip,
        totalPage: totalPage,
        totalRecord: totalRecord
    }
    //end phan trang
    const tourList = await Tour
        .find(find)
        .sort({
            position:"desc"
        })
        .limit(limitItem)
        .skip(skip)

    for ( const item of tourList) {
        if(item.createdBy) {
            const infoAccountAdminCreated = await AccountAdmin.findOne({
                _id: item.createdBy
            })
            item.createdByFullName = infoAccountAdminCreated.fullName;
            
        }

        if(item.createdAt) {
            const infoAccountAdminUpdated = await AccountAdmin.findOne({
                _id: item.updatedBy
            })
            item.updatedByFullName = infoAccountAdminUpdated.fullName;
        }
        item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
        item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
    }
        
    res.render('admin/pages/tour-list', {
        pageTitle:"Quản lý tour",
        tourList: tourList,
        accountAdminList: accountAdminList,
        categoryList: categoryTree,
        pagination: pagination
    })
}

module.exports.create = async (req,res) => {

    const categoryList = await Category.find({
        deleted:false
    })

    const cityList =  await City.find({});

    
    const categoryTree = categoryHelper.buildCategoryTree(categoryList);
    res.render('admin/pages/tour-create', {
        pageTitle:"Tạo tour",
        categoryList: categoryTree,
        cityList: cityList
    })
}

module.exports.createPost = async ( req, res) => {
    if(!req.permissions.includes("tour-create")) {
    res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!"
    })
    return;
  }



    if(req.body.position) {
        req.body.position = parseInt(req.body.position)
    } else {
        const totalRecord = await Tour.countDocuments({});
        req.body.position= totalRecord+1;
    }

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    if(req.files && req.files.avatar) {
        req.body.avatar = req.files.avatar[0].path;
    } else {
        delete req.body.avatar;
    }

    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult): 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren): 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby): 0;
    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult): req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren): req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby): req.body.priceBaby;
    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];

    if(req.files && req.files.images && req.files.images.length > 0) {
        req.body.images = req.files.images.map(file => file.path);
    } else {
        delete req.body.images;
    }

    const newRecord = new Tour(req.body);
    await newRecord.save();
    req.flash("success", "Tạo tour thành công!")

    res.json({
        code: "success",
    })
}

module.exports.trash = async (req,res) => {

    const find = {
        deleted:true
    };

    const tourList = await Tour
        .find(find)
        .sort({
            deletedAt:"desc"
        })
    console.log(tourList);
    for ( const item of tourList) {
        if(item.createdBy) {
            const infoAccountAdminCreated = await AccountAdmin.findOne({
                _id: item.createdBy
            })
            item.createdByFullName = infoAccountAdminCreated.fullName;
            
        }

        if(item.deletedBy) {
            const infoAccountAdminDeleted = await AccountAdmin.findOne({
                _id: item.deletedBy
            })
            item.deletedByFullName = infoAccountAdminDeleted.fullName;
        }
        item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
        item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YYYY");
    }
    res.render('admin/pages/tour-trash', {
        pageTitle:"Thùng rác tour",
        tourList:tourList
    })
}

module.exports.undoPatch = async (req, res) => {
    try {
        const id = req.params.id;

        await Tour.updateOne({
            _id:id
        },{
            deleted:false,
        })

        req.flash("success", "Khôi phục thành công!")
        res.json({
            code:"success"
        })
    } catch (error) {
        res.json({
            code:"error",
            message: "Id không hợp lệ!"
        })
    }
}

module.exports.destroy = async (req,res) => {
    try {
        const id = req.params.id;

        await Tour.deleteOne({
            _id:id
        })

        req.flash("success", "Xóa vĩnh viễn thành công!");

        res.json({
            code:"success",
        })
    } catch (error) {
        res.json({
            code:"error",
            message:"Id không hợp lệ!"
        })
    }
}

module.exports.trashMulti = async (req, res) => {
    try {
        const {option, ids} = req.body;
        switch (option) {
            case "undo":
                await Tour.updateMany({
                    _id:{$in: ids}
                },{
                    deleted:false
                })
                req.flash("success", "Khôi phục thành công!")
                break;
        
            case"destroy":
                await Tour.deleteMany({
                    _id:{$in: ids}
                })
                req.flash("success", "Xóa vĩnh viễn thành công!")
                break;
        }
        res.json({
            code:"success"
        })
    } catch (error) {
        res.json({
            code:"error",
            message:"Id không hợp lệ!"
        })
    }
}
module.exports.changeMultiPatch = async (req, res) => {
    try {
        const { option, ids } = req.body;

        switch (option) {
            case"active":
            case"inactive":
                await Tour.updateMany({
                    _id:{ $in : ids}
                }, {
                    status: option
                });
                req.flash("success", "Đổi trạng thái thành công!")
                break;
            case"delete":
                await Tour.updateMany({
                    _id: {$in : ids}
                }, {
                    deleted: true,
                    deletedBy: req.account.id,
                    deletedAt: Date.now(),
                });
                req.flash("success", "Xóa Thành Công!");
                break;
        }
    res.json({
        code: "success"
    })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không tồn tại trong hệ thống!"
        })
    }

}

module.exports.edit = async (req,res) => {
    try {

    const id = req.params.id;

    const tourDetail = await Tour.findOne({
        _id:id,
        deleted:false,
    })
    if (tourDetail) {
        
        tourDetail.departureDateFomat = moment(tourDetail.departureDate).format("YYYY-MM-DD");
        const categoryList = await Category.find({
            deleted:false,
        });



        const categoryTree = categoryHelper.buildCategoryTree(categoryList);

        const cityList = await City.find({});

        res.render('admin/pages/tour-edit', {
            pageTitle:"Chinhr Sửa Tour",
            categoryList: categoryTree,
            cityList: cityList,
            tourDetail: tourDetail,
        })
    } else {
        res.redirect(`/${pathadmin}/tour/list`)
    }

    } catch (error) {
        res.redirect(`/${pathadmin}/tour/list`)
    }
}
module.exports.editPatch = async (req, res) => {
    if (!req.permissions.includes("tour-edit")){
        res.json({
            code:"error",
            message:"Không có quyền sử dụng tính năng này!"
        })
        return;
    }
  try {
    const id = req.params.id;

    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const totalRecord = await Tour.countDocuments({});
      req.body.position = totalRecord + 1;
    }

    req.body.updatedBy = req.account.id;
    if(req.files && req.files.avatar) {
      req.body.avatar = req.files.avatar[0].path;
    } else {
      delete req.body.avatar;
    }

    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockAdult ? parseInt(req.body.stockChildren) : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    req.body.schedules = req.body.locations ? JSON.parse(req.body.schedules) : [];

     if(req.files && req.files.images && req.files.images.length > 0) {
      req.body.images = req.files.images.map(file => file.path);
    } else {
      delete req.body.images;
    }

    await Tour.updateOne({
      _id: id,
      deleted: false
    }, req.body)

    req.flash("success", "Cập nhật tour thành công!")

    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}

module.exports.deletePatch = async (req, res) => {
    if(!req.permissions.includes("tour-delete")){
        res.json({
            code:"error",
            message:"Không có quyền sử dụng chức năng này!"
        })
        return;
    }
    try {
        const id = req.params.id;

        await Tour.updateOne({
            _id:id,
        },{
            deleted:true,
            deletedBy:req.account.id,
            deletedAt:Date.now(),
        })

        req.flash("success","Xóa tour thành công!")
        res.json({
            code:"success"
        })
    } catch (error) {
        res.json({
            code:"error",
            message:"Id khong hop le",
        })
    }
}