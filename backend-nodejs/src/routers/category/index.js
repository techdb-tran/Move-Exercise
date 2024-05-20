"use strict";

const express = require("express");
const { asyncHandler } = require("../../helper/async.handler");
const categoriesController = require("../../controllers/categories.controller");
const router = express.Router();
const validate = require("../../middlewares/validate");
const { categoryIdParamsSchema } = require("../../validators/schemas");
const { authentication } = require("../../auth/authUtils");

router.get("/", asyncHandler(categoriesController.view));

router.get(
  "/:cate_id",
  validate(categoryIdParamsSchema, "params"),
  asyncHandler(categoriesController.categoryInfo)
);

router.post(
  "/user-follow",
  authentication,
  asyncHandler(categoriesController.followCategory)
);

module.exports = router;
