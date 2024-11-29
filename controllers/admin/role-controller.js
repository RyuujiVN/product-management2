const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }

    const records = await Role.find(find);

    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records
    });
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    const find = {
        deleted: false
    }

    const records = await Role.find(find);

    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo nhóm quyền",
        records: records
    });
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    console.log(req.body);

    const record = await new Role(req.body).save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const record = await Role.findOne({ _id: id });
        console.log(record);
        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            record: record
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, req.body);

    res.redirect("back");
}

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    const find = {
        deleted: false
    }

    const records = await Role.find(find);

    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records
    })
}

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);

    for (const item of permissions) {
        const id = item.id;
        const permissions = item.permissions;

        await Role.updateOne({ _id: id }, { permissions: permissions });
    }
    res.redirect("back");
}