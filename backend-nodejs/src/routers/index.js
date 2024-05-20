"use strict";

const express = require("express");
const router = express.Router();

router.use("/auth", require("./access/index"));
router.use("/categories", require("./category/index"));
router.use("/user", require("./user/index"));
router.use("/follow", require("./follow/index"));
router.use("/featured-carousel", require("./featured_carousel/index"));
router.use("/video", require("./video/index"));
router.use("/search", require("./search/index"));
router.use("/notification", require("./notification/index"));
router.use("/analytic", require("./analytic/index"));
router.use("/comment", require("./comment/index"));
router.use("/reply-comment", require("./reply_comment/index"));

module.exports = router;
