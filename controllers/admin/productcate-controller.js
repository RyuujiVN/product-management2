const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const filterStatus = require("../../helpers/filterStatus");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }

    if (req.query.status) {
        find.status = req.query.status;
    }

    const records = await ProductCategory.find(find);
    const filter = filterStatus(req.query);

    res.render("admin/pages/product-category/index.pug", {
        pageTitle: "Danh mục sản phẩm",
        records: records,
        filterStatus: filter
    });
}

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
    const find = {
        deleted: false
    };

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper(records);

    res.render("admin/pages/product-category/create.pug", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords
    });
}

// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
    const newCategory = req.body;

    if (newCategory.position == "") {
        const countCategory = await ProductCategory.countDocuments();
        newCategory.position = countCategory + 1;
    }
    else {
        newCategory.position = parseInt(newCategory.position);
    }

    await new ProductCategory(newCategory).save();
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
}

// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false
        }
    
        const records = await ProductCategory.find(find);
    
        const newRecords = createTreeHelper(records);
    
        const id = req.params.id;
        const data = await ProductCategory.findOne({
            _id: id,
            deleted: false
        });
    
        res.render("admin/pages/product-category/edit.pug", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            records: newRecords,
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/product-category`);
    }
}

// [PATCH] /admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const newCategory = req.body;
    const id = req.params.id;

    newCategory.position = parseInt(newCategory.position);

    try {
        await ProductCategory.updateOne({ _id: id }, newCategory);
    } catch (error) {
        
    }

    res.redirect("back");
}