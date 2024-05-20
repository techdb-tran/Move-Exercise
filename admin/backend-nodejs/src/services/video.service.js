"use strict";

const db = require("../models");
const { Op } = require("sequelize");
const apiRequest = require("../config/connect.vimeo");
const GetDate = require("../utils/getDate");

class VideoService {
  static countVideoView = async (startDate, endDate) => {
    const whereCondition = GetDate.getDateRangeCondition(startDate, endDate);

    whereCondition.is_hide = {
      [Op.ne]: true,
    };

    const top10Videos = await db.video.findAll({
      where: whereCondition,
      order: [["count_view", "DESC"]],
      limit: 10,
    });

    const top10VideoIds = top10Videos.map((video) => video.id);

    const data = await db.video.findAll({
      where: {
        id: top10VideoIds,
      },
      order: [["createdAt", "DESC"]],
    });

    return data;
  };

  static videoList = async (
    page_size,
    page,
    startDate,
    endDate,
    filters,
    searchTerm,
    hide
  ) => {
    let offset = (page - 1) * page_size;
    const whereCondition = GetDate.getDateRangeCondition(startDate, endDate);
    let order = [];

    switch (+filters) {
      case 1:
        order = [["count_view", "DESC"]];
        break;
      case 2:
        order = [["count_view", "ASC"]];
        break;
      case 3:
        order = [["average_rates", "DESC"]];
        break;
      case 4:
        order = [["average_rates", "ASC"]];
        break;
      default:
        break;
    }

    whereCondition.title = {
      [Op.like]: `%${searchTerm}%`,
      [Op.ne]: null,
    };

    hide = hide === "true" ? false : true;

    whereCondition.is_hide = {
      [Op.ne]: hide,
    };

    const { count, rows } = await db.video.findAndCountAll({
      attributes: [
        "id",
        "description",
        "thumbnail",
        "url",
        "user_id",
        "category_id",
        "keyword",
        "is_comment",
        "is_exist",
        "created_at",
        "updated_at",
        "count_view",
        "level",
        "title",
        "duration_time",
        "duration",
        [
          db.sequelize.literal(
            "(SELECT SUM(rate)/COUNT(*) FROM rate_videos WHERE video.id = rate_videos.video_id)"
          ),
          "average_rates",
        ],
        [
          db.sequelize.literal(
            "(SELECT SUM(count_reply_comment)+COUNT(*) FROM comments WHERE video.id = comments.video_id)"
          ),
          "count_comment",
        ],
      ],
      include: [
        {
          model: db.user,
          attributes: { exclude: ["password"] },
        },
        {
          model: db.Category,
          attributes: ["name"],
        },
      ],
      where: whereCondition,
      order,
      limit: +page_size,
      offset: offset,
    });

    return {
      totalVideo: count,
      videos: rows,
    };
  };

  static deleteVideos = async (ids) => {
    await db.sequelize.transaction(async (t) => {
      let videos = await db.video.findAll({
        where: {
          id: ids,
        },
        transaction: t,
      });

      videos.forEach((video) => {
        const urlParts = video.dataValues.url.split("/");
        const videoId = urlParts[urlParts.length - 1];
        apiRequest(videoId, "delete");
      });

      await db.video.destroy({
        where: {
          id: ids,
        },
        transaction: t,
      });
    });
  };

  static hideVideo = async (id) => {
    await db.video.update(
      {
        is_hide: db.Sequelize.literal("NOT is_hide"),
      },
      {
        where: {
          id,
        },
      }
    );
  };

  static findById = async (id) => {
    return await db.video.findAll({
      where: {
        id,
      },
    });
  };
}

module.exports = VideoService;
