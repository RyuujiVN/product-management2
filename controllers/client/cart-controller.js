const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productHelper = require("../../helpers/products");

// [GET] /cart/
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

    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cart: cart
    });
}

// [POST] /cart/add/:product
module.exports.addPost = async (req, res) => {
    const id = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    const product = cart.products.find(item => item.product_id === id);

    if (product) {
        product.quantity = product.quantity + quantity;
        await Cart.updateOne({
            _id: cart.id,
            "products.product_id": id
        }, {
            $set: {
                "products.$.quantity": product.quantity
            }
        });
    }
    else {
        const cartObject = {
            product_id: id,
            quantity: quantity
        };

        await Cart.updateOne({ _id: cartId }, {
            $push: { products: cartObject }
        });

    }
    res.redirect("back");
}

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const productId = req.params.productId;
    const cartId = req.cookies.cartId;

    await Cart.updateOne({
        _id: cartId
    }, {
        $pull: { products: { product_id: productId } }
    })

    res.redirect("back");
}

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const productId = req.params.productId;
    const quantity = req.params.quantity;
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    await Cart.updateOne({
        _id: cart.id,
        "products.product_id": productId
    }, {
        $set: {
            "products.$.quantity": quantity
        }
    })

    res.redirect("back");
}