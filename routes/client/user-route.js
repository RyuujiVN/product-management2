const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user-controller");
const validate = require("../../validate/client/user-validate");
const authenMiddleware = require("../../middleware/client/authen-middleware");

router.get("/register", controller.register);

router.post("/register", validate.register, controller.registerPost);

router.get("/login", controller.login);

router.post("/login", validate.login, controller.loginPost);

router.get("/logout", controller.logout);

router.get("/password/forgot", controller.forgotPassword);

router.post("/password/forgot", validate.forgotPassword, controller.forgotPasswordPost);

router.get("/password/otp", controller.passwordOtp);

router.post("/password/otp", controller.passwordOtpPost);

router.get("/password/reset", controller.resetPassword);

router.post("/password/reset", validate.resetPassword, controller.resetPasswordPost);

router.get("/info", authenMiddleware.requireAuthen, controller.info);


module.exports = router;