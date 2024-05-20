"use strict";

const express = require("express");
const { asyncHandler } = require("../../helper/async.handler");
const featuredCarouselController = require("../../controllers/featured_carousels.controller");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.get("/", authentication, asyncHandler(featuredCarouselController.view));

router.post(
  "/add/:id",
  authentication,
  asyncHandler(featuredCarouselController.add)
);

router.delete(
  "/remove/:id",
  authentication,
  asyncHandler(featuredCarouselController.remove)
);

module.exports = router;
