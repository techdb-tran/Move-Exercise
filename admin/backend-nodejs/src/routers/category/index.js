"use strict";

const express = require("express");
const { asyncHandler } = require("../../middlewares");
const { authentication } = require("../../auth/authUtils");
const validate = require("../../middlewares/validate");
const categoriesController = require("../../controllers/categories.controller");
const {
  timeSchema,
  querySchema,
  createCategorySchema,
  idSchema,
} = require("../../validators/schemas");
const upload = require("../../middlewares/upload.file");
const router = express.Router();

router.get(
  "/overview",
  authentication,
  validate(timeSchema, "query"),
  asyncHandler(categoriesController.overView)
);

router.get(
  "/all",
  authentication,
  validate(querySchema, "query"),
  asyncHandler(categoriesController.categoriesList)
);

router.post(
  "/add",
  authentication,
  upload.single("image_url"),
  validate(createCategorySchema, "body"),
  asyncHandler(categoriesController.createCategory)
);

router.patch(
  "/edit/:id",
  authentication,
  validate(idSchema, "params"),
  upload.single("image_url"),
  validate(createCategorySchema, "body"),
  asyncHandler(categoriesController.editCategory)
);

router.get(
  "/info/:id",
  authentication,
  validate(idSchema, "params"),
  asyncHandler(categoriesController.categoryInfo)
);

module.exports = router;
