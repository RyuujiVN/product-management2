const express = require("express");
const multer = require('multer');
const upload = multer();

const uploadCloud = require("../../middleware/admin/uploadCloud");
const controller = require("../../controllers/admin/my-account-controller");

const router = express.Router();

router.get('/', controller.index);
router.get('/edit',
    upload.single('avatar'),
    uploadCloud.uploadCloudinary,
    controller.edit);
router.patch('/edit',
    upload.single('avatar'),
    uploadCloud.uploadCloudinary,
    controller.editPatch);
module.exports = router;