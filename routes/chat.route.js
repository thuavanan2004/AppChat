const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../middleware/uploadsClound.middleware");
const controller = require("../controller/chat.controller")

const listChatMiddleware = require("../middleware/listChatSibar.middleware");

const checkAllowMiddleware = require("../middleware/checkAllow.middleware");

router.get("/", listChatMiddleware.listChat, controller.chatAll);  

router.get("/:roomChatId", checkAllowMiddleware.isAccess, listChatMiddleware.listChat, controller.chatPrivate);

router.post("/create", upload.single("avatar"), uploadCloud.uploadSingle ,controller.createPost);

module.exports = router;  