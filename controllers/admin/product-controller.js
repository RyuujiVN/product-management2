const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

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