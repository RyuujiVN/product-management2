const express = require("express");
const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {

    const expiresCookie = 365 * 24 * 60 * 60 * 1000;

    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();

        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresCookie)
        });
    }
    else {
        const cart = await Cart.findOne({ _id: req.cookies.cartId });

        cart.totalQuantity = cart.products.reduce((total, item) => total + item.quantity, 0);
        res.locals.minicart = cart;
    }
    next();
}