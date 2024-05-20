"use strict";

const JWT = require("jsonwebtoken");
const { envConfig } = require("../constants/config");
const { asyncHandler } = require("../helper/async.handler");
const {
  NOT_FOUND,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN
} = require("../core/error.response");
const { RES_MESSAGE } = require("../constants/message");
const { findByUserIdAndUserAgent } = require("../services/token.service");
const UserBanService = require("../services/user_ban.service");

const createTokenPair = async (payload, public_key) => {
  try {
    const accessToken = JWT.sign(payload, public_key, {
      expiresIn: envConfig.accessTokenExpiresIn,
    });

    return accessToken;
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  const browse_id = req.headers["browse-id"];

  const user_id = req.headers["client-id"];

  if (!user_id) throw new BAD_REQUEST();

  const key_store = await findByUserIdAndUserAgent(user_id, browse_id);

  if (!key_store) {
    throw new NOT_FOUND(RES_MESSAGE.USER_NOT_LOGIN);
  }

  const access_token = req.headers["authorization"].split(" ")[1];

  try {
    const decode_user = JWT.verify(access_token, key_store.public_key);

    if (user_id != decode_user.user_id) throw new UNAUTHORIZED();

    const user_ban = await UserBanService.findById(user_id);
    const ban_expired_at = user_ban.ban_expired_at;

    if (user_ban.is_permaban) {
      throw new FORBIDDEN(RES_MESSAGE.PERMABANNED);
    }

    const now = new Date();
    if (ban_expired_at > now) {
      throw new FORBIDDEN(ban_expired_at);
    }

    req.key_store = key_store;

    return next();
  } catch (error) {
    throw new UNAUTHORIZED(error.message);
  }
});

module.exports = {
  createTokenPair,
  authentication,
};
