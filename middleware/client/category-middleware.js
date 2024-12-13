const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
    const find = {
        deleted: false
    };

    const productCategory = await ProductCategory.find(find);

    const newRecords = createTreeHelper(productCategory);

    res.locals.productCategory = newRecords;

    next();
}