const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");

module.exports.home = async (req, res) => {
    const find = {
        featured: "1",
        status: "active",
        deleted: false
    }

    const productFeatured = await Product.find(find).limit(6);

    const productNew = await Product.find({
        status: "active",
        deleted: false
    }).limit(6).sort({ position: "desc" });

    const newProducts = productHelper.productNew(productNew);

    const newProductsFetured = productHelper.productNew(productFeatured);

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productFeatured: newProductsFetured,
        productNew: newProducts
    });
};