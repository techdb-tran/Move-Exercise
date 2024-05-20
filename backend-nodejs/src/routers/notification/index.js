"use strict";

const express = require("express");
const { asyncHandler } = require("../../helper/async.handler");
const { authentication } = require("../../auth/authUtils");
const validate = require("../../middlewares/validate");
const { getAllNotiQuerySchema } = require("../../validators/schemas");
const notificationController = require("../../controllers/notification.controller");
const router = express.Router();

router.get(
  "/count-unread",
  authentication,
  asyncHandler(notificationController.countUnreadNoti)
);

router.get(
  "/",
  authentication,
  validate(getAllNotiQuerySchema, "query"),
  asyncHandler(notificationController.getAllNoti)
);

module.exports = router;
