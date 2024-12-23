const express = require("express");
const multer = require('multer');
const upload = multer();

const uploadCloud = require("../../middleware/admin/uploadCloud");
const router = express.Router();



const controller = require("../../controllers/admin/product-controller");

router.get('/', controller.index);
router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);
router.delete('/delete/:id', controller.deleteProduct);
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
router.get('/detail/:id', controller.detail);
router.patch('/detail/:id', controller.detail);

module.exports = router;