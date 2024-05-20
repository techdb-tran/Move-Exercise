"use strict";

const express = require("express");
const { asyncHandler } = require("../../middlewares");
const { authentication } = require("../../auth/authUtils");
const validate = require("../../middlewares/validate");
const { timeSchema } = require("../../validators/schemas");
const videosController = require("../../controllers/videos.controller");
const router = express.Router();

router.get(
  "/overview",
  authentication,
  validate(timeSchema, "query"),
  asyncHandler(videosController.overView)
);

router.get("/list", authentication, asyncHandler(videosController.viewList));

router.get("/list/hidden", authentication, asyncHandler(videosController.viewListHidden));

router.post(
  "/delete",
  authentication,
  asyncHandler(videosController.deleteVideos)
);

router.post(
  "/hide/:video_id",
  authentication,
  asyncHandler(videosController.hideVideo)
);

module.exports = router;
