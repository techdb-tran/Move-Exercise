"use strict";

const { RES_MESSAGE } = require("../constants/message");
const { CREATED, OK, UPDATED } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  logIn = async (req, res, next) => {
    new OK({
      message: RES_MESSAGE.LOGIN_SUCCESSFULLY,
      metadata: await AccessService.login(req.body, req.headers["user-agent"]),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: RES_MESSAGE.CREATE_SUCCESSFULLY,
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  resendOtp = async (req, res, next) => {
    new OK({
      metadata: await AccessService.resendOtp(req.headers["email"]),
    }).send(res);
  };

  verifySignUpOtp = async (req, res, next) => {
    new OK({
      message: "Verified",
      metadata: await AccessService.verifySignUpOtp(
        req.headers["email"],
        req.body.otp
      ),
    }).send(res);
  };

  forgotPassword = async (req, res) => {
    new OK({
      message: await AccessService.forgotPassword(req.body.email),
    }).send(res);
  };

  checkForgotPasswordToken = async (req, res) => {
    new OK({
      message: RES_MESSAGE.FORGOT_PW_TOKEN_VALID,
      metadata: await AccessService.verifyForgotPasswordToken(req.params.token),
    }).send(res);
  };

  resetPassword = async (req, res) => {
    new OK({
      message: await AccessService.resetPassword(
        req.params.token,
        req.body.password
      ),
    }).send(res);
  };

  logout = async (req, res, next) => {
    const { user_id, browse_id } = req.key_store;
    new OK({
      message: RES_MESSAGE.LOGOUT_SUCCESSFULLY,
      metadata: await AccessService.logout(user_id, browse_id),
    }).send(res);
  };
}

module.exports = new AccessController();
