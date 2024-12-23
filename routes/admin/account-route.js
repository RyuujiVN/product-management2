const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer();

const uploadCloud = require("../../middleware/admin/uploadCloud");
const controller = require("../../controllers/admin/account-controller");

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create', upload.single('avatar'), uploadCloud.uploadCloudinary, controller.createPost);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', upload.single('avatar'), uploadCloud.uploadCloudinary, controller.editPatch);
module.exports = router;