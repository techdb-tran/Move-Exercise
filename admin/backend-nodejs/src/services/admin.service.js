"use strict";

const { RES_MESSAGE } = require("../constants/message");
const { NOT_FOUND } = require("../core/error.response");
const db = require("../models/index");

class AdminService {
  static findByUsername = async (username) => {
    const data = await db.admin.findOne({
      where: {
        username: username,
      },
    });
    if (!data) {
      throw new NOT_FOUND(RES_MESSAGE.ADMIN_NOT_FOUND);
    }
    return data;
  };
  static update = async (username, public_key) => {
    const data = await db.admin.findOne({
      where: {
        username: username,
      },
    });
    if (!data) {
      throw new NOT_FOUND(RES_MESSAGE.ADMIN_NOT_FOUND);
    }

    data.public_key = public_key;

    data.save();
    return data;
  };

  static remove = async (username) => {

    const data = await db.admin.findOne({
      where: { username },
    });

    data.public_key = null;
    data.save();
    return;
  };
}

module.exports = AdminService;
