const searchHelper = require("../../helpers/search");
const productHelper = require("../../helpers/products");
const Product = require("../../models/product.model");

// [GET] /search
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;

    const search = searchHelper(req.query);

    let newProducts = []

    if (keyword) {
        const products = await Product.find({
            title: search.regex,
            deleted: false,
            status: "active"
        });

        newProducts = productHelper.productNew(products);
    }

    res.render("client/pages/search/index", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProducts
    });
}