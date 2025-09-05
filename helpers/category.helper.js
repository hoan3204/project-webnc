const Category = require("../models/category.model");

const buildCategoryTree = (categories, parentId = "") => {
    const tree = [];

    categories.forEach(item => {
        if(item.parent == parentId) {
            const children = buildCategoryTree(categories, item.id);

            tree.push({
                id: item.id,
                name: item.name,
                slug:item.slug,
                children: children
            })
        }
    })

    return tree;
}

module.exports.buildCategoryTree = buildCategoryTree;


//lay tat ca id cua danh muc cha + con
module.exports.getAllSubcategoryIds = async (parentId) => {
    const result = [parentId]

    //ham de quy tim danh muc con
    const findChildren = async (currentId) => {
        //tim cac danh muc con co parent = currentId , k bi xoa va dang hoat dong
        const children = await Category
            .find({
                parent: currentId,
                deleted:false ,
                status:"active"
            });

            //duyet danh muc con tim duoc
            for (const child of children) {
                result.push(child.id); // them id vao danh sach ket qua
                await findChildren(child.id);//goi de quy tim danh muc con cua muc nay
            }
    };
    await findChildren(parentId);

    return result;
}
//end lay id danh muc cha + con