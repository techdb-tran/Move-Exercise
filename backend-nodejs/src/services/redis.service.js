"use strict";

const redisClient = require("../config/connect.redis");
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require("../core/error.response");
const { RES_MESSAGE } = require("../constants/message");

class RedisService {
  static saveOtpToRedis = async (email, otp) => {
    const data = await redisClient.get(email);
    if (data) {
      throw new INTERNAL_SERVER_ERROR(RES_MESSAGE.OTP_ALREADY_SET);
    }
    const dataOTP = {
      otp: otp,
    };
    redisClient.setEx(
      email,
      120,
      JSON.stringify(dataOTP),
      (err, reply) => {
        if (err) {
          throw new INTERNAL_SERVER_ERROR(RES_MESSAGE.OTP_NOT_SET);
        }
      }
    );
  };

  static getOtpFromRedis = async (email) => {
    const data = await redisClient.get(email);
    if (data) {
      return JSON.parse(data);
    } else {
      throw new NOT_FOUND(RES_MESSAGE.OTP_NOT_FOUND);
    }
  };

  static saveTokenToRedis = async (token, email) => {
    const tokenExpiresIn = 120;
    redisClient.setEx(token, tokenExpiresIn, email, (err, reply) => {
      if (err) {
        throw new INTERNAL_SERVER_ERROR(RES_MESSAGE.OTP_NOT_SET);
      }
    });
  };

  static getEmailFromRedis = async (token) => {
    const data = await redisClient.get(token);
    if (!data) {
      throw new NOT_FOUND(RES_MESSAGE.TOKEN_NOT_FOUND);
    }
    return data;
  };

  static deleteTokenFromRedis = async (token) => {
    await redisClient.del(token);
  };
}
module.exports = RedisService;
