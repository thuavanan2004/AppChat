const express = require("express");
const router = express.Router();
const controller  = require("../controller/users.controller");

router.get("/not-friends", controller.notFriends);

router.get("/friends", controller.friends);

router.get("/request", controller.request);

router.get("/accept", controller.accept);

module.exports = router;