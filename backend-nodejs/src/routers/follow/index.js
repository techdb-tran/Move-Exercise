"use strict";

const express = require("express");
const { asyncHandler } = require("../../helper/async.handler");
const followsController = require("../../controllers/follows.controller");
const { authentication } = require("../../auth/authUtils");
const validate = require("../../middlewares/validate");
const {
  followUserSchema,
  categoryIdParamsSchema,
  paginationQuerySchema,
} = require("../../validators/schemas");
const router = express.Router();

router.get(
  "/followed-channels",
  authentication,
  validate(paginationQuerySchema, "query"),
  asyncHandler(followsController.followedChannnels)
);

router.get(
  "/follow-user/:user_id",
  authentication,
  validate(followUserSchema, "params"),
  asyncHandler(followsController.getFollowUser)
);

router.post(
  "/follow-user/:user_id",
  authentication,
  validate(followUserSchema, "params"),
  asyncHandler(followsController.followUser)
);

router.get(
  "/category/:cate_id",
  authentication,
  validate(categoryIdParamsSchema, "params"),
  asyncHandler(followsController.checkFollowCategory)
);

router.post(
  "/category/:cate_id/",
  authentication,
  validate(categoryIdParamsSchema, "params"),
  asyncHandler(followsController.followCategory)
);

module.exports = router;
