const md5 = require("md5");
const Account = require("../../models/accounts.model");
const systemConfig = require("../../config/system");

// [GET] /admin/my-account
module.exports.index = (req, res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Trang thông tin cá nhân"
    });
}

// [GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Trang chỉnh sửa thông tin cá nhân"
    });
}

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id;
    const account = req.body;

    const emailExist = await Account.findOne({
        _id: { $ne: id },
        email: account.email,
        deleted: false
    });

    if (!emailExist) {
        if (account.password != "") {
            account.password = md5(account.password);
        }
        else {
            delete account.password;
        }
        res.redirect(`${systemConfig.prefixAdmin}/my-account`);
    }

}