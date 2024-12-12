const ProductCategory = require("../models/product-category.model");

module.exports.getSubCategory = (id) => {
    const getCategory = async (id) => {
        const productCategorys = await ProductCategory.find({
            parent_id: id,
            status: "active",
            deleted: false
        });

        let arrSub = [...productCategorys];

        for (const item of arrSub) {
            const child = await getCategory(item.id);
            arrSub = arrSub.concat(child);
        }
        return arrSub;
    }

    const result = getCategory(id);
    return result;
}