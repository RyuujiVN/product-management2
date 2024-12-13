const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const productHelper = require("../../helpers/products");

// [GET] /checkout/
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id: productId
            }).select("title thumbnail slug price discountPercentage")

            const newPrice = productHelper.productNewPrice(productInfo);

            productInfo.newPrice = newPrice;

            item.productInfo = productInfo;

            item.totalPrice = newPrice * item.quantity;
        }

        cart.totalPrice = cart.products.reduce((total, item) => total + item.totalPrice, 0);
    }

    res.render("client/pages/checkout/index", {
        pageTitle: "Giỏ hàng",
        cart: cart
    });
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;

    const cart = await Cart.findOne({
        _id: cartId
    });

    const productOrder = [];

    for (const item of cart.products) {
        const objectProduct = {
            product_id: item.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: item.quantity
        }

        const product = await Product.findOne({
            _id: item.product_id
        }).select("price discountPercentage");

        objectProduct.price = product.price;
        objectProduct.discountPercentage = product.discountPercentage;
        productOrder.push(objectProduct);
    }

    const orderInfo = {
        cart_id: cartId,
        userInfo: userInfo,
        products: productOrder
    }

    const order = await new Order(orderInfo).save();

    await Cart.updateOne({
        _id: cartId
    }, {
        products: []
    });

    res.redirect(`/checkout/success/${order.id}`);
}

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {

    const order = await Order.findOne({
        _id: req.params.orderId
    });

    for (const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail");

        product.productInfo = productInfo;

        product.priceNew = productHelper.productNewPrice(product);
        product.totalPrice = product.priceNew * product.quantity;
    }

    order.totalPrice = order.products.reduce((total, item) => total + item.totalPrice, 0);

    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt hàng thành công",
        order: order
    });
}