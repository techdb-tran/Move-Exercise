"use strict";

const { RES_MESSAGE } = require("../constants/message");
const { CREATED, OK, UPDATED } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  logIn = async (req, res, next) => {
    new OK({
      message: RES_MESSAGE.LOGIN_SUCCESSFULLY,
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    const { username } = req.admin;
    new OK({
      message: RES_MESSAGE.LOGOUT_SUCCESSFULLY,
      metadata: await AccessService.logout(username),
    }).send(res);
  };
}

module.exports = new AccessController();
