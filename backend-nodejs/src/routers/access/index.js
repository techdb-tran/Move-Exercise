"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helper/async.handler");
const validate = require("../../middlewares/validate");
const {
  forgotPasswordSchema,
  resetPasswordBodySchema,
  signUpAndLoginSchema,
  resetPasswordParamsSchema,
} = require("../../validators/schemas");
const router = express.Router();
const { authentication } = require("../../auth/authUtils");

router.post(
  "/login",
  validate(signUpAndLoginSchema),
  asyncHandler(accessController.logIn)
);

router.post(
  "/signup",
  validate(signUpAndLoginSchema),
  asyncHandler(accessController.signUp)
);

router.get("/signup/resend-otp", asyncHandler(accessController.resendOtp));

router.post("/signup/verify", asyncHandler(accessController.verifySignUpOtp));

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  asyncHandler(accessController.forgotPassword)
);

router.get(
  "/verify-forgot-password-token/:token",
  validate(resetPasswordParamsSchema, "params"),
  asyncHandler(accessController.checkForgotPasswordToken)
);

router.post(
  "/reset-password/:token",
  validate(resetPasswordParamsSchema, "params"),
  validate(resetPasswordBodySchema),
  asyncHandler(accessController.resetPassword)
);

router.post("/logout", authentication, asyncHandler(accessController.logout));

module.exports = router;
