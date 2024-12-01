const systemConfig = require("../../config/system");

const Account = require("../../models/accounts.model");

module.exports.requireAuthen = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.redirect(`${systemConfig.prefixAdmin}/authen/login`);
    }
    else {
        const user = await Account.findOne({ token: token });
        if (!user) {
            res.redirect(`${systemConfig.prefixAdmin}/authen/login`);
        }
        else {
            next();
        }
    }
}

