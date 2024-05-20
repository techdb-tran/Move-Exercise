"use strict";

const express = require("express");
const { asyncHandler } = require("../../helper/async.handler");
const featuredCarouselController = require("../../controllers/featured_carousels.controller");
const router = express.Router();

router.get("/", asyncHandler(featuredCarouselController.view));

module.exports = router;
