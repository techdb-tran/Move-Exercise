"use strict";

const express = require("express");
const { asyncHandler } = require("../../middlewares");
const userController = require("../../controllers/user.controller");
const { authentication } = require("../../auth/authUtils");
const validate = require("../../middlewares/validate");
const { querySchema } = require("../../validators/schemas");
const router = express.Router();

router.get(
  "/export-users",
  authentication,
  validate(querySchema, "query"),
  asyncHandler(userController.exportUsers)
);

router.get(
  "/",
  authentication,
  validate(querySchema, "query"),
  asyncHandler(userController.dataUsers)
);

router.get(
  "/total-view/:id",
  authentication,
  asyncHandler(userController.countTotalView)
);

module.exports = router;
