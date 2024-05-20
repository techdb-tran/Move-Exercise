"use strict";

const { Sequelize } = require("sequelize");
const db = require("../models");
const { userAttributes } = require("../constants/attributes");
const Convert = require("../utils/convert");

const queryUserData = {
  attributes: [
    ...userAttributes,
    [
      Sequelize.literal(
        "(SELECT COUNT(*) FROM videos WHERE videos.user_id = user.id)"
      ),
      "total_video",
    ],
    [
      Sequelize.literal(`CASE 
  WHEN user_ban.is_permaban = true THEN 'permaban'
  WHEN user_ban.is_permaban = false AND user_ban.ban_expired_at > NOW() THEN 'temporarily blocked'
  WHEN user.is_actived = true THEN 'activated'
  ELSE 'not activated' 
END`),
      "status",
    ],
    [
      Sequelize.literal(
        "(SELECT COUNT(*) FROM followers WHERE followers.followed_user_id = user.id)"
      ),
      "total_followers",
    ],
    [
      Sequelize.literal(
        "(SELECT SUM(count_view) FROM videos WHERE videos.user_id = user.id)"
      ),
      "total_view",
    ],
  ],
  include: [
    {
      model: db.user_ban,
      required: false,
      attributes: [],
    },
  ],
  raw: true, // chuyển thành mảng json
};

class UserService {
  static getUsers = async ({
    page,
    limit,
    sort_by = "id",
    sort_order = "ASC",
    filter_country = null,
    search = null,
  }) => {
    const offset = (page - 1) * limit;
    let whereCondition = {};

    if (filter_country !== null) {
      if (filter_country === "unknown") {
        whereCondition.country = { [Sequelize.Op.is]: null };
      } else {
        whereCondition.country = filter_country;
      }
    }

    if (search) {
      whereCondition[Sequelize.Op.or] = [
        { username: { [Sequelize.Op.like]: `%${search}%` } },
        { email: { [Sequelize.Op.like]: `%${search}%` } },
      ];
    }

    const usersData = await db.user.findAndCountAll({
      ...queryUserData,
      where: whereCondition,
      limit,
      offset,
      order: [[sort_by, sort_order]],
    });

    const totalPages = Math.ceil(usersData.count / limit);

    const usersWithIndex = usersData.rows.map((user, index) => ({
      ...user,
      index: offset + index + 1,
    }));

    return {
      totalUsers: usersData.count,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
      users: usersWithIndex,
    };
  };

  static getUsersDataAndConverToCSV = async ({
    sort_by = "id",
    sort_order = "ASC",
    filter_country = null,
    search = null,
  }) => {
    let whereCondition = {};

    if (filter_country) {
      whereCondition.country = filter_country;
    }

    if (search) {
      whereCondition[Sequelize.Op.or] = [
        { username: { [Sequelize.Op.like]: `%${search}%` } },
        { email: { [Sequelize.Op.like]: `%${search}%` } },
      ];
    }

    const usersData = await db.user.findAll({
      ...queryUserData,
      where: whereCondition,
      order: [[sort_by, sort_order]],
    });
    // return usersData;

    const csvData = Convert.convertToCSV(usersData);

    // const filePath = path.resolve(`users_data.csv`);
    // await fs.promises.writeFile(filePath, csvData);
    // console.log(filePath);

    return csvData;
  };

  static countTotalView = async (id) => {
    const totalView = await db.video.sum("count_view", {
      where: {
        user_id: id,
      },
    });
    return totalView;
  };
}

module.exports = UserService;
