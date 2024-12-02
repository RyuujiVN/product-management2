const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/accounts.model");
const Product = require("../../models/product.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const filterStatus = filterStatusHelper(req.query);

    if (req.query.status) {
        find.status = req.query.status;
    }

    const search = searchHelper(req.query);

    if (search.regex) {
        find.title = search.regex;
    }

    // Pagination
    const totalProduct = await Product.countDocuments(find);
    const pagination = paginationHelper(req.query, totalProduct);
    // End Pagination

    // Sort
    const sort = {};

    if (req.query.sortkey && req.query.sortvalue) {
        sort[req.query.sortkey] = req.query.sortvalue;
    }
    else {
        sort.position = "desc";
    }
    // End Sort
    const products = await Product.find(find)
        .limit(pagination.limitItem)
        .skip(pagination.skip)
        .sort(sort);

    for (const product of products) {
        // Lấy thông tin người tạo
        const user = await Account.findOne({ _id: product.createdBy.account_id });

        if (user) {
            product.accountFullName = user.fullName;
        }

        const timeDate = product.createdBy.createdAt;

        product.date = new Date(timeDate).toLocaleString();

        // Lấy thông tin người cập nhật gần nhất
        const [updatedBy] = product.updatedBy.slice(-1);
        if (updatedBy) {
            const userUpdated = await Account.findOne({ _id: updatedBy.account_id });

            updatedBy.accountFullName = userUpdated.fullName;
            const timeDateUpdated = new Date(updatedBy.updatedAt);
            updatedBy.date = timeDateUpdated.toLocaleString();
        }

    }

    const newProducts = products.map((item) => {
        item.priceNew = (item.price - item.price * item.discountPercentage / 100).toFixed(0);
        return item;
    });

    res.render("admin/pages/product/index", {
        pageTitle: "Trang sản phẩm",
        products: newProducts,
        filterStatus: filterStatus,
        keyword: search.keyword,
        pagination: pagination,
    });
}

// [PATCH] /admin/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const updated = {
        account_id: res.locals.user.id,
        updatedAt: Date.now()
    }

    await Product.updateOne({ _id: id }, { status: status, $push: { updatedBy: updated } });
    res.redirect("back");
}

// [PATCH] /admin/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const updated = {
        account_id: res.locals.user.id,
        updatedAt: Date.now()
    }

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active", $push: { updatedBy: updated } });
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive", $push: { updatedBy: updated } });
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: Date.now()
                },
                $push: { updatedBy: updated }
            });
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position, $push: { updatedBy: updated } });
            }
            break;
        default:
            break;
    }
    res.redirect("back");
}

// [PATCH] /admin/delete/:id
module.exports.deleteProduct = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({ _id: id }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: Date
        }
    });
    res.redirect("back");
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    const find = {
        deleted: false
    }

    const category = await ProductCategory.find(find);
    const newCategory = createTreeHelper(category);

    res.render("admin/pages/product/create", {
        pageTitle: "Trang tạo sản phẩm",
        category: newCategory
    });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    const newProduct = req.body;

    newProduct.price = parseInt(newProduct.price);
    newProduct.discountPercentage = parseInt(newProduct.discountPercentage);
    newProduct.stock = parseInt(newProduct.stock);

    if (newProduct.position == "") {
        const quantity = await Product.countDocuments();
        newProduct.position = quantity + 1;
    }
    else {
        newProduct.position = parseInt(newProduct.position);
    }

    newProduct.createdBy = {
        account_id: res.locals.user.id
    }

    await new Product(newProduct).save();
    res.redirect(`${systemConfig.prefixAdmin}/product`);
}

// [GET] /admin/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const category = await ProductCategory.find({
            deleted: false
        });
        const newCategory = createTreeHelper(category);

        const product = await Product.findOne(find);

        res.render("admin/pages/product/edit", {
            pageTile: "Chỉnh sửa sản phẩm",
            product: product,
            category: newCategory
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/product`);
    }
}

// [PATCH] /admin/edit/:id
module.exports.editPatch = async (req, res) => {
    const newProduct = req.body;

    newProduct.price = parseInt(newProduct.price);
    newProduct.discountPercentage = parseInt(newProduct.discountPercentage);
    newProduct.stock = parseInt(newProduct.stock);
    newProduct.position = parseInt(newProduct.position);

    try {
        const updated = {
            account_id: res.locals.user.id,
            updatedAt: Date.now()
        }

        await Product.updateOne({ _id: req.params.id }, {
            ...newProduct,
            $push: { updatedBy: updated }
        });
    } catch (error) {

    }
    res.redirect(`${systemConfig.prefixAdmin}/product`);
}

module.exports.detail = async (req, res) => {
    const find = {
        deleted: false,
        _id: req.params.id
    }

    const product = await Product.findOne(find);

    res.render("admin/pages/product/detail", {
        pageTile: product.title,
        product: product
    });
}