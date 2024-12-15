const User = require("../../models/users.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendEmail");

const md5 = require("md5");
const nodemailer = require("nodemailer");

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

    const cart = await Cart.findOne({
        user_id: user.id
    });

    if (cart) {
        res.cookie("cardId", cart.id);
    }
    else {
        await Cart.updateOne({
            _id: req.cookies.cartId
        }, {
            user_id: user.id
        })
    }

    res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.clearCookie("cardId");
    res.redirect("back");
};

// [GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu",
    });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        res.redirect("back");
        return;
    }

    const objectForgotPassword = {
        email: email,
        otp: generateHelper.generateRandomNumber(6),
        expireAt: Date.now()
    }

    await new ForgotPassword(objectForgotPassword).save();

    // Gửi otp qua email
    const subject = "Mã otp xác minh: ";
    const html = `
        Mã otp lấy lại mật khẩu là <b>${objectForgotPassword.otp}</b>.
        Thời hạn sử dụng là 3 phút
    `;

    sendMailHelper.sendEMail(email, subject, html);

    res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.passwordOtp = (req, res) => {
    const email = req.query.email;

    res.render("client/pages/user/password-otp", {
        pageTitle: "Lấy lại mật khẩu",
        email: email
    });
};

// [POST] /user/password/otp
module.exports.passwordOtpPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const forgotPassword = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });


    if (!forgotPassword) {
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email: email
    });

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi mật khẩu",
    });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    })

    res.redirect("/");
};

// [GET] /user/info
module.exports.info = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;

    res.render("client/pages/user/info", {
        pageTitle: "Trang thông tin tài khoản",
    });
};
