"use strict";

const JWT = require("jsonwebtoken");
const { envConfig } = require("../constants/config");
const { asyncHandler } = require("../helper/async.handler");
const { BAD_REQUEST, UNAUTHORIZED } = require("../core/error.response");
const AdminService = require("../services/admin.service");

const createTokenPair = async (payload, public_key) => {
  try {
    const accessToken = JWT.sign(payload, public_key, {
      expiresIn: envConfig.accessTokenExpiresIn,
    });
    return {
      accessToken,
    };
  } catch (error) {
    console.log(error);
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const admin_username = req.headers["admin-username"];

  if (!admin_username) throw new BAD_REQUEST();

  const admin = await AdminService.findByUsername(admin_username);

  const access_token = req.headers["authorization"].split(" ")[1];

  try {
    const decode_admin = JWT.verify(access_token, admin.public_key);

    if (admin_username != decode_admin.username) throw new UNAUTHORIZED();

    req.admin = admin;

    return next();
  } catch (error) {
    throw new UNAUTHORIZED(error.message);
  }
});

module.exports = {
  createTokenPair,
  authentication,
};
