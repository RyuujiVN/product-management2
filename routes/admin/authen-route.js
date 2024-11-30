const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/authen-controller");

router.get('/login', controller.login);
router.post('/login', controller.loginPost);
module.exports = router;