"use strict";

const { RES_MESSAGE } = require("../constants/message");
const { UPDATED, OK } = require("../core/success.response");
const UserService = require("../services/user.service");

class UsersController {
  setupProfile = async (req, res) => {
    const userBody = req.body;
    const { user_id } = req.key_store;
    new UPDATED({
      message: RES_MESSAGE.USER_UPDATE_SUCCESSFULLY,
      metadata: await UserService.setupProfile(userBody, user_id, req.file),
    }).send(res);
  };

  getProfile = async (req, res) => {
    new OK({
      metadata: await UserService.findById(req.key_store.user_id),
    }).send(res);
  };

  getGeneralInfo = async (req, res, next) => {

    let page = req.query.page || 1;
    
    new OK({
      metadata: await UserService.getGeneralInfo(req.params.user_id,page),
    }).send(res);
  };
}

module.exports = new UsersController();
