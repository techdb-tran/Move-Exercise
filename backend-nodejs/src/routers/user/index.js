"use strict";

const express = require("express");
const usersController = require("../../controllers/users.controller");
const { asyncHandler } = require("../../helper/async.handler");
const validate = require("../../middlewares/validate");
const {
  setupProfileSchema,
  generalInfoParamsSchema,
  setupNotificationsBodySchema,
} = require("../../validators/schemas");
const router = express.Router();
const Upload = require("../../middlewares/upload.file");
const { authentication } = require("../../auth/authUtils");
const notificationController = require("../../controllers/notification.controller");

router.patch(
  "/profile-setup",
  authentication,
  Upload.upload.single("avatar_url"),
  validate(setupProfileSchema),
  asyncHandler(usersController.setupProfile)
);

router.get(
  "/general-info/:user_id",
  validate(generalInfoParamsSchema, "params"),
  asyncHandler(usersController.getGeneralInfo)
);

router.get("/", authentication, asyncHandler(usersController.getProfile));

router.patch(
  "/notification-setup",
  authentication,
  validate(setupNotificationsBodySchema, "body"),
  asyncHandler(notificationController.setupNoti)
);

router.get(
  "/notification-setup",
  authentication,
  asyncHandler(notificationController.getSettingsNoti)
);

module.exports = router;
