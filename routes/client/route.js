const productRoutes = require("./product-route");
const homeRoutes = require("./home-route");
const searchRoutes = require("./search-route");
const cartRoutes = require("./cart-route");
const checkoutRoutes = require("./checkout-route");
const categoryMiddleware = require("../../middleware/client/category-middleware");
const cartMiddleware = require("../../middleware/client/cart-middleware");

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);

    app.use('/', homeRoutes);

    app.use('/product', productRoutes);

    app.use('/search', searchRoutes);

    app.use('/cart', cartRoutes);

    app.use('/checkout', checkoutRoutes);

}