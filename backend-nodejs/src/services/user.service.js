"use strict";

const { RES_MESSAGE } = require("../constants/message");
const {
  NOT_FOUND,
  FORBIDDEN,
  UNPROCESSABLE_ENTITY,
} = require("../core/error.response");
const db = require("../models/index");
const { Op } = require("sequelize");
const UserBanService = require("./user_ban.service");
const { Sequelize } = require("sequelize");

class UserService {
  static findByEmail = async ({ email }) => {
    const data = await db.user.findOne({
      where: {
        email: email,
      },
    });
    if (!data) throw new NOT_FOUND(RES_MESSAGE.USER_NOT_FOUND);
    return data;
  };

  static findById = async (id) => {
    const data = await db.user.findOne({
      where: {
        id,
      },
      attributes: [
        "id",
        "email",
        "username",
        "fullname",
        "gender",
        "birthday",
        "country",
        "state",
        "city",
        "is_verified",
        "is_actived",
        "avatar_url",
        "created_at",
        "updated_at",
      ],
    });
    if (!data) throw new NOT_FOUND(RES_MESSAGE.USER_NOT_FOUND);
    return data;
  };

  static create = async ({ email }, passwordHasd, username, avatar_url) => {
    const newUser = await db.user.create({
      email,
      password: passwordHasd,
      username,
      avatar_url,
    });
    return newUser;
  };

  static activeUser = async (email) => {
    await db.user.update(
      { is_actived: true },
      {
        where: {
          email: email,
        },
      }
    );
  };

  static setupProfile = async (user, userId, avatar) => {
    const existingUser = await db.user.findOne({
      where: {
        username: user.username,
        id: { [Op.ne]: userId },
      },
    });

    if (existingUser) {
      throw new UNPROCESSABLE_ENTITY(RES_MESSAGE.USERNAME_ALREADY_IN_USE);
    }
    let avatarUrl;

    if (avatar) {
      avatarUrl = avatar.path;
    }

    await db.user.update(
      {
        avatar_url: avatarUrl?.trim(),
        username: user.username?.trim(),
        fullname: user.fullname?.trim(),
        gender: user.gender,
        birthday: user.birthday,
        country: user.country?.trim(),
        state: user.state?.trim(),
        city: user.city?.trim(),
      },
      {
        where: {
          id: userId,
        },
      }
    );
  };

  static getGeneralInfo = async (user_id,page) => {
    const user_ban = await UserBanService.findById(user_id);

    const user = await db.user.findOne({
      attributes: [
        "username",
        "fullname",
        "is_verified",
        "avatar_url",
        [
          Sequelize.fn("COUNT", Sequelize.col("followers.followed_user_id")),
          "follow_count",
        ],
      ],
      include: [
        {
          model: db.follower,
          attributes: [],
        },
      ],
      where: {
        id: user_id,
      },
    });

    const ban_expired_at = user_ban.ban_expired_at;

    if (user_ban.is_permaban === true) {
      throw new FORBIDDEN(RES_MESSAGE.PERMABANNED);
    }

    const now = new Date();
    if (ban_expired_at > now) {
      throw new FORBIDDEN(ban_expired_at);
    }

    let perPage = 12;
    let offset = (page - 1) * perPage;

    const data = await db.user.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "is_verified",
        "avatar_url",
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM followers WHERE user.id = followers.followed_user_id)"
          ),
          "follow_count",
        ],
      ],
      include: [
        {
          model: db.follower,
          attributes: [],
          where: {
            follower_user_id: user_id,
          },
        },
      ],
      where: {
        [Op.or]: [{ is_verified: true }, { is_verified: false }],
      },
      order: [
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM followers WHERE user.id = followers.followed_user_id)"
          ),
          "DESC",
        ],
      ],
      limit: perPage,
      offset
    });
    return {
      user,
      data,
    };
  };

  static getUsername = async (username) => {
    const user = await db.user.findOne({
      where: {
        username,
      },
    });
    return user;
  };

  static searchUsers = async (searchTerm, perPage) => {
    const data = await db.user.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "is_verified",
        "avatar_url",
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM followers WHERE user.id = followers.followed_user_id)"
          ),
          "count_follow",
        ],
      ],
      where: {
        username: {
          [Op.like]: `%${searchTerm}%`,
        },
        is_actived: true,
      },
      order: [["is_verified", "DESC"]],
      limit: perPage,
    });
    return data;
  };
}

module.exports = UserService;
