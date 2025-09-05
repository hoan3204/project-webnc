const Category = require("../../models/category.model")
const slugify = require('slugify')
const moment = require('moment')
const categoryHelper = require("../../helpers/category.helper")
const AccountAdmin = require("../../models/account-admin.model")

module.exports.list = async (req,res) => {

    const find = {
        deleted:false,

    };

   //loc trang thai
    if(req.query.status){
        find.status = req.query.status;
    }
    //end trang thai

    //lay tai khoan quan tri
    const accountAdminList = await AccountAdmin
        .find({})
        .select("fullName")
    
    //end lay tk quan tri

    //loc theo nguoi tao
    if(req.query.createdBy) {
        find.createdBy = req.query.createdBy;
    }
    //end loc theo nguoi tao

    //loc theo ngay
    const dataFilter = {};

    if(req.query.startDate) {
        const startDate = moment(req.query.startDate).startOf("date").toDate();
        dataFilter.$gte = startDate;
    }

    if(req.query.endDate) {
        const endDate = moment(req.query.endDate).endOf("date").toDate();
        dataFilter.$lte = endDate;
    }

    if(Object.keys(dataFilter).length > 0) {
        find.createdAt = dataFilter;
    }
    //end loc theo ngay


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
    const totalRecord = await Category.countDocuments(find);
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
    const categoryList = await Category
        .find(find)
        .sort({
            position: "desc" //asc
        })
        .limit(limitItem)
        .skip(skip)


    for ( const item of categoryList) {
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

   

    res.render('admin/pages/category-list',{
        pageTitle:"Quản lý danh mục",
        categoryList: categoryList,
        accountAdminList: accountAdminList,
        pagination: pagination
    })
}

module.exports.create = async (req,res) => {

    const categoryList = await Category.find({
        deleted: false
    })

    
    const categoryTree = categoryHelper.buildCategoryTree(categoryList);


    res.render('admin/pages/category-create', {
        pageTitle:"Tạo danh mục",
        categoryList: categoryTree
    })
}

module.exports.edit = async (req, res) => {
    try {
        
    const categoryList = await Category.find({
        deleted: false
    })

    const categoryTree = categoryHelper.buildCategoryTree(categoryList);

    const id = req.params.id;
    const categoryDetail = await Category.findOne({
        _id: id,
        deleted: false
    })

    
    res.render("admin/pages/category-edit", {
        pageTitle: "Chỉnh Sửa danh mục",
        categoryList: categoryTree,
        categoryDetail: categoryDetail
    })
    } catch (error) {
        res.redirect(`/${pathadmin}/category/list`)
    }
}

module.exports.editPatch = async (req, res) => {
   try {
    const id = req.params.id;

    if(req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const totalRecord = await Category.countDocuments({});
        req.body.position = totalRecord + 1;
    }
    req.body.updatedBy = req.account.id;

    if(req.file) {
        req.body.avatar = req.file.path;
    } else {
        delete req.body.avatar;
    }

    await Category.updateOne({
        _id: id,
        deleted: false
    }, req.body)

    req.flash("success", "Cập Nhật Thành Công!");

    res.json({
        code: "success"
    })
   } catch (error) {
        res.json({
            code: "error",
            message:"Id không hợp lệ!"
        })
   }
}

module.exports.createPost = async (req,res) => {
    if(req.body.position){
        req.body.position= parseInt(req.body.position)
    } else {
        const totalRecord = await Category.countDocuments({});
        req.body.position = totalRecord + 1;
    }

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    req.body.avatar = req.file ? req.file.path : "" ;

    const newRecord = new Category(req.body);
    await newRecord.save();

    req.flash("success","Tạo danh mục thành công!" )

    res.json({
        code:"success",
        
    })
}

module.exports.deletePatch = async (req, res) => {
    try {
        const id = req.params.id;
        
        await Category.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedBy: req.account.id,
            deletedAt: Date.now()
        })

        req.flash("success", "Xóa thành công!");

        res.json({
            code: "success"
        });
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
                await Category.updateMany({
                    _id:{ $in : ids}
                }, {
                    status: option
                });
                req.flash("success", "Đổi trạng thái thành công!")
                break;
            case"delete":
                await Category.updateMany({
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