"use strict";

const { NOT_FOUND, FORBIDDEN } = require("../core/error.response");
const db = require("../models/index");

class UserBanService {
  static findById = async (id) => {
    const data = await db.user_ban.findOne({
      where: {
        user_id: id,
      },
    });
    if (!data) {
      throw new NOT_FOUND
    }
    return data;
  };

  static create = async (id) => {
    await db.user_ban.create({
      user_id: id,
      is_permaban: false,
      ban_expired_at: null
    });
  };
}

module.exports = UserBanService;
