"use strict";

const express = require("express");
const { asyncHandler } = require("../../helper/async.handler");
const router = express.Router();
const validate = require("../../middlewares/validate");
const analyticsController = require("../../controllers/analytics.controller");
const { authentication } = require("../../auth/authUtils");
const {
  videoAnalyticsQuerySchema,
  videoIdSchema,
  daysAgoSchema,
  analyzeStateViewsQuerySchema,
} = require("../../validators/schemas");

router.get(
  "/videos",
  authentication,
  validate(videoAnalyticsQuerySchema, "query"),
  asyncHandler(analyticsController.videoAnalytics)
);

router.get(
  "/video/:video_id",
  authentication,
  validate(videoIdSchema, "params"),
  asyncHandler(analyticsController.videoStat)
);

router.get(
  "/overview",
  authentication,
  asyncHandler(analyticsController.overview)
);

router.get(
  "/latest-video",
  authentication,
  asyncHandler(analyticsController.latestVideo)
);

router.get(
  "/video-details-gender/:video_id",
  authentication,
  validate(videoIdSchema, "params"),
  validate(daysAgoSchema, "query"),
  asyncHandler(analyticsController.analyzeGenderViewsForVideo)
);

router.get(
  "/video-details-age/:video_id",
  authentication,
  validate(videoIdSchema, "params"),
  validate(daysAgoSchema, "query"),
  asyncHandler(analyticsController.analyzeAgeViewsForVideo)
);

router.get(
  "/video-details-country/:video_id",
  authentication,
  validate(videoIdSchema, "params"),
  validate(daysAgoSchema, "query"),
  asyncHandler(analyticsController.analyzeCountryViewsForVideo)
);

router.get(
  "/video-details-state/:video_id",
  authentication,
  validate(videoIdSchema, "params"),
  validate(analyzeStateViewsQuerySchema, "query"),
  asyncHandler(analyticsController.analyzeStateViewsForVideo)
);

module.exports = router;
