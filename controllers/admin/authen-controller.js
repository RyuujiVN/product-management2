const Account = require("../../models/accounts.model");
const md5 = require('md5');

const systemConfig = require("../../config/system");

// [GET] /admin/authen/login
module.exports.login = async (req, res) => {
    const token = req.cookies.token;
    const user = await Account.findOne({ token: token });

    if (token && user) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
    else {
        res.render("admin/pages/auth/login", {
            pageTitle: "Trang đăng nhập"
        })
    }
}

// [POST] /admin/authen/login
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;

    const user = await Account.findOne({
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

    if (user.status === "inactive") {
        res.redirect("back");
        return;
    }

    res.cookie("token", user.token);

    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

// [GET] /admin/authen/logout
module.exports.logout = (req, res) => {
    res.clearCookie("token");

    res.redirect(`${systemConfig.prefixAdmin}/authen/login`);
}