"use strict";
const express = require("express");
const router = express.Router();

router.use("/users", require("./users/index"));
router.use("/auth", require("./access/index"));
router.use("/category", require("./category/index"));
router.use("/video", require("./video/index"));
router.use("/comment", require("./comment/index"));
router.use("/reply-comment", require("./reply_comment/index"));
router.use("/featured-carousel", require("./featured_carousel/index"));

module.exports = router;
