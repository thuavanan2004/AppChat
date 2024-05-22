const express = require("express");
const multer  = require('multer');
const router = express.Router();
const controller = require("../controller/user.controller");
const upload = multer();    
const uploadClound = require("../middleware/uploadsClound.middleware");

router.get("/info", controller.info);

router.get("/edit", controller.edit);

router.patch("/edit/:userId", upload.single("avatar"), uploadClound.uploadSingle, controller.editPatch);

module.exports = router;