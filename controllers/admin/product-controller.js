const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    const filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ];

    let find = {
        deleted: false
    }
    if(req.query.status) {
        find.status = req.query.status;
        const indexStatus = filterStatus.findIndex(item => item.status === req.query.status);
        filterStatus[indexStatus].class = "active";
    }
    else {
        const indexStatus = filterStatus.findIndex(item => item.status === "");
        filterStatus[indexStatus].class = "active";
    }
    const products = await Product.find(find);

    const newProducts = products.map((item) => {
        item.priceNew = (item.price - item.price * item.discountPercentage / 100).toFixed(0);
        return item;
    });

    

    res.render("admin/pages/product/index", {
        pageTitle: "Trang sản phẩm",
        products: newProducts,
        filterStatus: filterStatus
    });
}