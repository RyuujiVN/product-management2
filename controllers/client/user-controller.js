const User = require("../../models/users.model");
const md5 = require("md5");

// [GET] /user/register
module.exports.register = async (req, res) => {

    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản",
    });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    console.log(req.body);

    const existEmail = await User.findOne({
        email: req.body.email
    });

    if (existEmail) {
        res.redirect("back");
        return;
    }

    req.body.password = md5(req.body.password);

    const user = await new User(req.body).save();

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
};

// [GET] /user/login
module.exports.login = async (req, res) => {

    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập",
    });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        res.redirect("back");
        return;
    }

    if (md5(password) !== user.password) {
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
};

// [GET] /user/register
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("back")
};