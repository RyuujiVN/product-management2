const systemConfig = require("../../config/system");

const Account = require("../../models/accounts.model");
const Role = require("../../models/roles.model");

module.exports.requireAuthen = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.redirect(`${systemConfig.prefixAdmin}/authen/login`);
    }
    else {
        const user = await Account.findOne({ token: token }).select("-password");
        if (!user) {
            res.redirect(`${systemConfig.prefixAdmin}/authen/login`);
        }
        else {
            const role = await Role.findOne({ _id: user.role_id }).select("title permissions");

            res.locals.user = user;
            res.locals.role = role;
            next();
        }
    }
}

