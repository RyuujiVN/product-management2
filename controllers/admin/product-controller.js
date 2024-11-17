const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

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
    const products = await Product.find(find).limit(pagination.limitItem).skip(pagination.skip).sort({ position: "desc" });

    const newProducts = products.map((item) => {
        item.priceNew = (item.price - item.price * item.discountPercentage / 100).toFixed(0);
        return item;
    });

    res.render("admin/pages/product/index", {
        pageTitle: "Trang sản phẩm",
        products: newProducts,
        filterStatus: filterStatus,
        keyword: search.keyword,
        pagination: pagination
    });
}

// [PATCH] /admin/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { status: status });
    res.redirect("back");
}

// [PATCH] /admin/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                dateDeleted: new Date()
            });
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
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
        dateDeleted: new Date()
    });
    res.redirect("back");
}

// [GET] /admin/products/create
module.exports.create = (req, res) => {

    res.render("admin/pages/product/create", {
        pageTitle: "Trang tạo sản phẩm",
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

    if (req.file.filename) {
        newProduct.thumbnail = `/uploads/${req.file.filename}`;
    }

    console.log(newProduct);

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

        const product = await Product.findOne(find);

        res.render("admin/pages/product/edit", {
            pageTile: "Chỉnh sửa sản phẩm",
            product: product
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

    if (req.file.filename) {
        newProduct.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        await Product.updateOne({ _id: req.params.id }, newProduct);
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