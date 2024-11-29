const express = require("express");
const multer = require('multer');
const upload = multer();

const uploadCloud = require("../../middleware/admin/uploadCloud");
const router = express.Router();

const controller = require("../../controllers/admin/productcate-controller");

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create',
    upload.single('thumbnail'),
    uploadCloud.uploadCloudinary,
    controller.createPost);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id',
    upload.single('thumbnail'),
    uploadCloud.uploadCloudinary,
    controller.editPatch);


module.exports = router;