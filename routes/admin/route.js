const dashboardRoute = require("./dashboard-route");
const roleRoute = require("./role-route");
const productRoute = require("./product-route");
const productCateRoute = require("./productcate-route");
const accountRoute = require("./account-route");
const authenRoute = require("./authen-route");

const authenMiddleware = require("../../middleware/admin/authen-middleware");

const PATH_ADMIN = require("../../config/system");

module.exports = (app) => {
    app.use(PATH_ADMIN.prefixAdmin + "/dashboard", authenMiddleware.requireAuthen, dashboardRoute);
    app.use(PATH_ADMIN.prefixAdmin + "/product", authenMiddleware.requireAuthen, productRoute);
    app.use(PATH_ADMIN.prefixAdmin + "/product-category", authenMiddleware.requireAuthen, productCateRoute);
    app.use(PATH_ADMIN.prefixAdmin + "/roles", authenMiddleware.requireAuthen, roleRoute);
    app.use(PATH_ADMIN.prefixAdmin + "/accounts", authenMiddleware.requireAuthen, accountRoute);
    app.use(PATH_ADMIN.prefixAdmin + "/authen", authenRoute);
}