const express = require("express");
const router = express.Router();
const controller = require("../controller/chat.controller")

router.get("/", controller.home);

module.exports = router;