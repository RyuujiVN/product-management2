const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

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
    const products = await Product.find(find).limit(pagination.limitItem).skip(pagination.skip);

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