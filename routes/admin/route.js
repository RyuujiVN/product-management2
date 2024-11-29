const dashboardRoute = require("./dashboard-route");
const roleRoute = require("./role-route");
const productRoute = require("./product-route");
const productCateRoute = require("./productcate-route");
const PATH_ADMIN = require("../../config/system");

module.exports = (app) => {
    app.use(PATH_ADMIN.prefixAdmin + "/dashboard", dashboardRoute);
    app.use(PATH_ADMIN.prefixAdmin + "/product", productRoute);
    app.use(PATH_ADMIN.prefixAdmin + "/product-category", productCateRoute);
    app.use(PATH_ADMIN.prefixAdmin + "/roles", roleRoute);
}