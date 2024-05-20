"use strict";

const db = require("../models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./token.service");
const { createTokenPair } = require("../auth/authUtils");
const Generator = require("../utils/generator");
const ejs = require("ejs");
const fs = require("fs");

const { CONFLICT, BAD_REQUEST, FORBIDDEN } = require("../core/error.response");
const Mailer = require("../utils/mailer");
const { RES_MESSAGE } = require("../constants/message");
const { envConfig } = require("../constants/config");
const UserBanService = require("./user_ban.service");
const UserService = require("./user.service");
const NotificationService = require("./notifications.service");
const { IMAGE } = require("../constants/media");
const CategoriesService = require("./categories.service");
const Redis = require("../utils/redis");
const FilterObject = require("../utils/filterObject");

class AccessService {
  static login = async ({ email, password }) => {
    const foundUser = await UserService.findByEmail({ email });

    const user_ban = await UserBanService.findById(foundUser.id);
    const ban_expired_at = user_ban.ban_expired_at;

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
      throw new BAD_REQUEST(RES_MESSAGE.WRONG_PASSWORD);
    }

    if (!foundUser.is_actived) {
      throw new FORBIDDEN(RES_MESSAGE.USER_NOT_ACTIVATED);
    }

    if (user_ban.is_permaban) {
      throw new FORBIDDEN(RES_MESSAGE.PERMABANNED);
    }

    const now = new Date();
    if (ban_expired_at > now) {
      throw new FORBIDDEN(ban_expired_at);
    }

    const public_key = crypto.randomBytes(64).toString("hex");
    const browse_id = crypto.randomBytes(64).toString("hex");

    const token = await createTokenPair({ user_id: foundUser.id }, public_key);

    await KeyTokenService.createKeyToken({
      user_id: foundUser.id,
      browse_id,
      public_key,
    });

    return {
      user: FilterObject.getInfoData({
        fileds: ["id", "email"],
        object: foundUser,
      }),
      token,
      browse_id,
    };
  };

  static signUp = async ({ email, password }) => {
    const holderUser = await db.user.findOne({
      where: {
        email: email,
      },
    });

    if (holderUser) {
      throw new CONFLICT(RES_MESSAGE.EMAIL_ALREADY_EXISTSTS);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let username = email
      .substring(0, email.indexOf("@"))
      .replace(/[^a-zA-Z0-9]/g, "");

    let user = await UserService.getUsername(username);

    while (user !== null && user.username === username) {
      username += Generator.codeGenerator({
        length: 6,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        digits: true,
        specialChars: false,
      });
      user = await UserService.getUsername(username);
    }
    const avataUrl = IMAGE.avatarUrl;

    const newUser = await UserService.create(
      { email },
      passwordHash,
      username,
      avataUrl
    );

    await UserBanService.create(newUser.id);

    await NotificationService.create(newUser.id);

    await CategoriesService.followAllCategory(newUser.id);

    const otp = Generator.codeGenerator({
      length: 6,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      digits: true,
      specialChars: false,
    });

    await Redis.saveOtpToRedis(email, otp);

    const subject = "Sign up";
    const ejsTemplate = fs.readFileSync(
      "src/views/register_otp_template.ejs",
      "utf8"
    );
    const html = ejs.render(ejsTemplate, { otp });

    await Mailer.sendMail(email, subject, html);

    return {
      user: FilterObject.getInfoData({
        fileds: ["id", "email"],
        object: newUser,
      }),
    };
  };

  static resendOtp = async (email) => {
    const holderUser = await UserService.findByEmail({ email });

    if (holderUser.is_actived === true) {
      throw new CONFLICT(RES_MESSAGE.USER_ALREADY_ACTIVATED);
    }

    const otp = Generator.codeGenerator({
      length: 6,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      digits: true,
      specialChars: false,
    });

    await Redis.saveOtpToRedis(email, otp);

    const subject = "Resend OTP";

    const ejsTemplate = fs.readFileSync(
      "src/views/register_otp_template.ejs",
      "utf8"
    );
    const html = ejs.render(ejsTemplate, { otp });

    await Mailer.sendMail(email, subject, html);
  };

  static verifySignUpOtp = async (email, otp) => {
    const holderUser = await UserService.findByEmail({ email });

    if (holderUser.is_actived === true) {
      throw new CONFLICT(RES_MESSAGE.USER_ALREADY_ACTIVATED);
    } else {
      const otpFromRedis = await Redis.getOtpFromRedis(email);

      if (otpFromRedis.otp === otp) {
        await UserService.activeUser(email);
      } else {
        throw new BAD_REQUEST(RES_MESSAGE.INVALID_OTP);
      }

      const public_key = crypto.randomBytes(64).toString("hex");
      const browse_id = crypto.randomBytes(64).toString("hex");

      const token = await createTokenPair(
        { user_id: holderUser.id },
        public_key
      );

      const keyStore = await KeyTokenService.createKeyToken({
        user_id: holderUser.id,
        browse_id,
        public_key,
      });
      if (!keyStore) {
        throw new BAD_REQUEST(RES_MESSAGE.INVALID_PUBLIC_KEY);
      }

      return {
        user: FilterObject.getInfoData({
          fileds: ["id", "email"],
          object: holderUser,
        }),
        token,
        browse_id,
      };
    }
  };

  static forgotPassword = async (email) => {
    const user = await UserService.findByEmail({ email });

    const token = Generator.codeGenerator({
      length: 30,
      lowerCaseAlphabets: true,
      upperCaseAlphabets: true,
      digits: true,
      specialChars: false,
    });
    const emailEncoded = btoa(email);

    // save token to redis storage
    await Redis.saveTokenToRedis(token, email);

    const link = `${envConfig.clientUrl}/reset-password/${token}/${emailEncoded}`;
    const ejsTemplate = fs.readFileSync(
      "src/views/forgot_password_template.ejs",
      "utf8"
    );
    const html = ejs.render(ejsTemplate, {
      username: user.username,
      link,
    });
    Mailer.sendMail(user.email, RES_MESSAGE.SENT_FORGOT_PASSWORD_SUCCESS, html);

    return RES_MESSAGE.FORGOT_PASSWORD_SUCCESS;
  };

  static verifyForgotPasswordToken = async (token) => {
    const getEmailAndCheckToken = await Redis.getEmailFromRedis(token);

    return {
      token,
      email: getEmailAndCheckToken,
    };
  };

  static resetPassword = async (token, newPassword) => {
    const email = await Redis.getEmailFromRedis(token);

    const user = await UserService.findByEmail({ email });

    const passwordHash = await bcrypt.hash(newPassword, 10);

    user.password = passwordHash;
    await Promise.all([
      user.update({ password: passwordHash }), // Update new password
      Redis.deleteTokenFromRedis(token), // Delete token from Redis
    ]);
    return RES_MESSAGE.PASSWORD_RESET_SUCESS;
  };

  static logout = async (user_id, browse_id) => {
    const delKey = await KeyTokenService.removeKeyById(user_id, browse_id);
    return delKey;
  };
}

module.exports = AccessService;
