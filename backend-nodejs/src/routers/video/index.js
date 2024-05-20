"use strict";

const express = require("express");
const { asyncHandler } = require("../../helper/async.handler");
const videosController = require("../../controllers/videos.controller");
const {
  watchAlsoParamsSchema,
  topVideosQuerySchema,
  videoYouMayLikeQuerySchema,
  videoListSchema,
  categoryIdParamsSchema,
  videoListOfCategoryQuerySchema,
  generalInfoParamsSchema,
  paginationQuerySchema,
} = require("../../validators/schemas");
const validate = require("../../middlewares/validate");
const { authentication } = require("../../auth/authUtils");
const { valid } = require("joi");
const router = express.Router();

router.get(
  "/video-you-may-like",
  validate(videoYouMayLikeQuerySchema, "query"),
  asyncHandler(videosController.videoYouMayLike)
);

router.get(
  "/watch-also/:video_id",
  validate(watchAlsoParamsSchema, "params"),
  asyncHandler(videosController.watchAlso)
);

router.get(
  "/top-videos",
  validate(topVideosQuerySchema, "query"),
  asyncHandler(videosController.topVideos)
);

router.get(
  "/list",
  authentication,
  validate(videoListSchema, "query"),
  asyncHandler(videosController.videoList)
);

router.post(
  "/list",
  authentication,
  asyncHandler(videosController.deleteVideo)
);

router.get(
  "/list-of-category/:cate_id",
  validate(categoryIdParamsSchema, "params"),
  validate(videoListOfCategoryQuerySchema, "query"),
  asyncHandler(videosController.videoListOfCategory)
);

router.get(
  "/list-video-of-user/:user_id",
  validate(generalInfoParamsSchema, "params"),
  validate(paginationQuerySchema, "query"),
  asyncHandler(videosController.viewVideoOfUser)
);

module.exports = router;
