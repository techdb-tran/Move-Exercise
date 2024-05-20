"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { BAD_REQUEST } = require("../core/error.response");
const { RES_MESSAGE } = require("../constants/message");
const { createTokenPair } = require("../auth/authUtils");
const AdminService = require("./admin.service");

class AccessService {
  static login = async ({ username, password }) => {
    const admin = await AdminService.findByUsername(username);

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      throw new BAD_REQUEST(RES_MESSAGE.WRONG_PASSWORD);
    }

    const public_key = crypto.randomBytes(64).toString("hex");

    const accessToken = await createTokenPair(
      {
        id: admin.id,
        username: admin.username,
      },
      public_key
    );

    await AdminService.update(username, public_key);

    return accessToken;
  };

  static logout = async (username) => {
    await AdminService.remove(username);
    return;
  };
}

module.exports = AccessService;
