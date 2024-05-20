"use strict";

const { Sequelize, Op } = require("sequelize");
const { NOT_FOUND } = require("../core/error.response");
const db = require("../models/index");
const { VIDEO_RES_MESSAGE } = require("../constants/message");
const apiRequest = require("../config/connect.vimeo");
const Cloudinary = require("../utils/cloudinary");

class VideoService {
  static addAdditionalInfoToVideo = () => {
    return {
      attributes: [
        "id",
        "title",
        "thumbnail",
        "url",
        "user_id",
        "category_id",
        "keyword",
        "is_comment",
        "count_view",
        "level",
        "duration",
        "duration_time",
        "created_at",
        "updated_at",
        [
          Sequelize.literal(
            '(SELECT AVG(rate) FROM rate_videos WHERE video_id = "video"."id")'
          ),
          "average_rates",
        ],
        [
          Sequelize.literal(
            '(SELECT name FROM categories WHERE id = "video"."category_id")'
          ),
          "category_name",
        ],
      ],
      include: [
        {
          model: db.user,
          attributes: [
            "id",
            "username",
            "fullname",
            "avatar_url",
            "is_verified",
          ],
        },
      ],
    };
  };

  static findById = async (id) => {
    return await db.video.findByPk(id);
  };

  static getRelatedVideos = async (currentVideoId) => {
    const currentVideo = await this.findById(currentVideoId);
    if (!currentVideo) throw new NOT_FOUND(VIDEO_RES_MESSAGE.NOT_FOUND);

    const queryCondition = this.addAdditionalInfoToVideo();

    const { count, rows } = await db.video.findAndCountAll({
      where: {
        [Op.or]: [
          { user_id: currentVideo.user_id },
          { category_id: currentVideo.category_id },
          { keyword: currentVideo.keyword },
          { level: currentVideo.level },
        ],
        id: { [Op.ne]: currentVideoId },
        title: {
          [Op.ne]: null,
        },
        duration_time: {
          [Op.ne]: null,
        },
        is_hide: false,
      },
      ...queryCondition,
      order: Sequelize.literal("RAND()"),
      limit: 5,
    });

    const relatedVideos = rows;
    const relatedVideoIds = rows.map((video) => video.id);

    // Insert unrelated videos in case 5 related videos are missing
    if (count < 5) {
      const randomVideos = await db.video.findAll({
        where: {
          id: { [Op.notIn]: [...relatedVideoIds, currentVideoId] },
          title: {
            [Op.ne]: null,
          },
          duration_time: {
            [Op.ne]: null,
          },
          is_hide: false,
        },
        ...queryCondition,
        order: Sequelize.literal("RAND()"),
        limit: 5 - count,
      });
      relatedVideos = [...relatedVideos, ...randomVideos];
    }

    return relatedVideos;
  };

  static videoYouMayLike = async (id, page) => {
    const attributes = [
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
          "(SELECT name FROM categories WHERE video.category_id = categories.id)"
        ),
        "category_name",
      ],
    ];

    const queryCondition = {
      title: {
        [Op.ne]: null,
      },
      duration_time: {
        [Op.ne]: null,
      },
      is_hide: {
        [Op.ne]: true,
      },
    };
    //Lấy video nhiều view nhất của mỗi user
    const getVideoWithTheMostViewsFromUser = `(user_id, count_view) IN (
      SELECT user_id, MAX(count_view) AS max_views
      FROM videos
      GROUP BY user_id
    )`;

    const getCategoryIdByUserId = `(
      SELECT category_id FROM user_follower_categories WHERE user_id = ${id}
    )`;

    const getFollowedUserIdByUserId = `(
      SELECT followed_user_id FROM followers WHERE follower_user_id = ${id}
    )`;
    let perPage = 6;
    let offset = (page - 1) * perPage;

    if (!id) {
      const videos = await db.video.findAll({
        attributes,
        include: [
          {
            model: db.user,
            attributes: { exclude: ["password"] },
            required: true,
          },
        ],
        where: {
          [Op.and]: [
            Sequelize.literal(getVideoWithTheMostViewsFromUser),
            queryCondition,
          ],
        },
        order: [["count_view", "DESC"]],
        limit: perPage,
        offset: offset,
      });

      return videos;
    }

    const queryConditionVideoUserFollowCategory = {
      [Op.and]: [
        Sequelize.literal(getVideoWithTheMostViewsFromUser),
        {
          category_id: {
            [Op.in]: db.Sequelize.literal(getCategoryIdByUserId),
          },
          user_id: {
            [Op.ne]: id,
            [Op.notIn]: db.Sequelize.literal(getFollowedUserIdByUserId),
          },
        },
        queryCondition,
      ],
    };

    const queryConditionVideoUserFollowUser = {
      [Op.and]: [
        Sequelize.literal(getVideoWithTheMostViewsFromUser),
        {
          category_id: {
            [Op.notIn]: db.Sequelize.literal(getCategoryIdByUserId),
          },
          user_id: {
            [Op.ne]: id,
            [Op.in]: db.Sequelize.literal(getFollowedUserIdByUserId),
          },
        },
        queryCondition,
      ],
    };

    const queryConditionVideoUserNotFollowUserAndCategory = {
      [Op.and]: [
        Sequelize.literal(getVideoWithTheMostViewsFromUser),
        {
          category_id: {
            [Op.notIn]: db.Sequelize.literal(getCategoryIdByUserId),
          },
          user_id: {
            [Op.ne]: id,
            [Op.notIn]: db.Sequelize.literal(getFollowedUserIdByUserId),
          },
        },
        queryCondition,
      ],
    };

    const queryConditionVideoUserFollowUserAndCategory = {
      [Op.and]: [
        Sequelize.literal(getVideoWithTheMostViewsFromUser),
        {
          category_id: {
            [Op.in]: db.Sequelize.literal(getCategoryIdByUserId),
          },
          user_id: {
            [Op.ne]: id,
            [Op.in]: db.Sequelize.literal(getFollowedUserIdByUserId),
          },
        },
        queryCondition,
      ],
    };

    const findvideo = async (where, offset, limit) => {
      return await db.video.findAll({
        attributes,
        include: [
          {
            model: db.user,
            attributes: { exclude: ["password"] },
            required: true,
          },
        ],
        where,
        order: [["count_view", "DESC"]],
        offset,
        limit,
      });
    };

    const countVideoUserFollowCategory = await db.video.count({
      where: queryConditionVideoUserFollowCategory,
    });

    const countVideoUserFollowUser = await db.video.count({
      where: queryConditionVideoUserFollowUser,
    });

    const countVideoUserFollowUserAndCategory = await db.video.count({
      where: queryConditionVideoUserFollowUserAndCategory,
    });

    const countVideoUserNotFollowUserAndCategory = await db.video.count({
      where: queryConditionVideoUserNotFollowUserAndCategory,
    });

    let videos = [];

    let countVideo = countVideoUserFollowCategory;

    if (~~(countVideo / perPage) >= +page) {
      videos = videos.concat(
        await findvideo(queryConditionVideoUserFollowCategory, offset, perPage)
      );
    }

    if (videos.length === perPage) {
      return videos;
    }
    countVideo = countVideoUserFollowCategory + countVideoUserFollowUser;

    if (~~(countVideo / perPage) >= +page) {
      if (countVideoUserFollowCategory - offset >= 0) {
        videos = videos.concat(
          await findvideo(
            queryConditionVideoUserFollowCategory,
            offset,
            perPage
          )
        );
        offset = 0;
      } else {
        offset = offset - countVideoUserFollowCategory;
      }
      videos = videos.concat(
        await findvideo(
          queryConditionVideoUserFollowUser,
          offset,
          perPage - videos.length
        )
      );
    }
    if (videos.length === perPage) {
      return videos;
    }
    countVideo =
      countVideoUserFollowCategory +
      countVideoUserFollowUser +
      countVideoUserFollowUserAndCategory;

    if (~~(countVideo / perPage) >= +page) {
      if (countVideoUserFollowCategory - offset >= 0) {
        videos = videos.concat(
          await findvideo(
            queryConditionVideoUserFollowCategory,
            offset,
            perPage
          )
        );
        offset = 0;
      } else {
        offset = offset - countVideoUserFollowCategory;
      }
      if (
        countVideoUserFollowCategory + countVideoUserFollowUser - offset >=
        0
      ) {
        videos = videos.concat(
          await findvideo(queryConditionVideoUserFollowUser, offset, perPage)
        );
        offset = 0;
      } else {
        offset = offset - countVideoUserFollowUser;
      }
      videos = videos.concat(
        await findvideo(
          queryConditionVideoUserFollowUserAndCategory,
          offset,
          perPage - videos.length
        )
      );
    }
    if (videos.length === perPage) {
      return videos;
    }
    countVideo =
      countVideoUserFollowCategory +
      countVideoUserFollowUser +
      countVideoUserFollowUserAndCategory +
      countVideoUserNotFollowUserAndCategory;
    if (~~(countVideo / perPage) >= +page) {
      if (countVideoUserFollowCategory - offset >= 0) {
        videos = videos.concat(
          await findvideo(
            queryConditionVideoUserFollowCategory,
            offset,
            perPage
          )
        );
        offset = 0;
      } else {
        offset = offset - countVideoUserFollowCategory;
      }

      if (
        countVideoUserFollowCategory +
          countVideoUserFollowUser -
          perPage * (page - 1) >=
        0
      ) {
        videos = videos.concat(
          await findvideo(queryConditionVideoUserFollowUser, offset, perPage)
        );
        offset = 0;
      } else {
        offset = offset - countVideoUserFollowUser;
      }

      if (
        countVideoUserFollowCategory +
          countVideoUserFollowUser +
          countVideoUserFollowUserAndCategory -
          perPage * (page - 1) >=
        0
      ) {
        videos = videos.concat(
          await await findvideo(
            queryConditionVideoUserFollowUserAndCategory,
            offset,
            perPage
          )
        );
        offset = 0;
      } else {
        offset = offset - countVideoUserFollowUserAndCategory;
      }

      videos = videos.concat(
        await findvideo(
          queryConditionVideoUserNotFollowUserAndCategory,
          offset,
          perPage - videos.length
        )
      );
    }

    if (videos.length === perPage) {
      return videos;
    }

    if (countVideo % perPage != 0) {
      if (countVideoUserFollowCategory - offset >= 0) {
        videos = videos.concat(
          await findvideo(
            queryConditionVideoUserFollowCategory,
            offset,
            perPage
          )
        );
        offset = 0;
      } else {
        offset = offset - countVideoUserFollowCategory;
      }

      if (
        countVideoUserFollowCategory +
          countVideoUserFollowUser -
          perPage * (page - 1) >=
        0
      ) {
        videos = videos.concat(
          await findvideo(queryConditionVideoUserFollowUser, offset, perPage)
        );
        offset = 0;
      } else {
        offset = offset - countVideoUserFollowUser;
      }

      if (
        countVideoUserFollowCategory +
          countVideoUserFollowUser +
          countVideoUserFollowUserAndCategory -
          perPage * (page - 1) >=
        0
      ) {
        videos = videos.concat(
          await findvideo(
            queryConditionVideoUserFollowUserAndCategory,
            offset,
            perPage
          )
        );
        offset = 0;
      } else {
        offset = offset - countVideoUserFollowUserAndCategory;
      }

      videos = videos.concat(
        await findvideo(
          queryConditionVideoUserNotFollowUserAndCategory,
          offset,
          perPage - videos.length
        )
      );
    }
    return videos;
  };

  static getAllVideos = async (filters, page, limit) => {
    const queryCondition = this.addAdditionalInfoToVideo();

    const {
      category,
      level,
      sort_by = "most_recent",
      sort_order = "DESC",
      cate_id,
    } = filters;

    const orderConditions = [];
    if (sort_by === "total_view")
      orderConditions.push(["count_view", sort_order]);
    if (sort_by === "duration_time")
      orderConditions.push(["duration_time", sort_order]);
    if (sort_by === "average_rates")
      orderConditions.push([
        Sequelize.literal(
          '(SELECT AVG(rate) FROM rate_videos WHERE video_id = "video"."id")'
        ),
        sort_order,
      ]);
    if (sort_by === "most_recent") orderConditions.push(["created_at", "DESC"]);

    const whereCondition = {
      title: {
        [Op.ne]: null,
      },
      duration_time: {
        [Op.ne]: null,
      },
      is_hide: false,
    };
    if (category) {
      const categoryInfo = await db.Category.findOne({
        where: { name: category, is_show: 1 },
      });
      if (categoryInfo) whereCondition.category_id = categoryInfo.id;
    }
    if (level) whereCondition.level = level;
    if (cate_id) whereCondition.category_id = cate_id;

    const { rows, count } = await db.video.findAndCountAll({
      ...queryCondition,
      where: whereCondition,
      order: orderConditions,
      offset: (page - 1) * limit,
      limit,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      page,
      totalVideos: count,
      totalPages,
      currentPage: page,
      videos: rows,
    };
  };

  static searchVideos = async (searchTerm, perPage) => {
    const data = await db.video.findAll({
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
            "(SELECT name FROM categories WHERE video.category_id = categories.id)"
          ),
          "category_name",
        ],
      ],
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                title: {
                  [Op.like]: `%${searchTerm}%`,
                },
              },
              {
                keyword: {
                  [Op.like]: `%${searchTerm}%`,
                },
              },
            ],
          },
          {
            duration_time: {
              [Op.ne]: null,
            },
          },
          {
            is_hide: {
              [Op.ne]: true,
            },
          },
          {
            title: {
              [Op.ne]: null,
            },
          },
        ],
      },

      include: [
        {
          model: db.user,
          attributes: { exclude: ["password"] },
          required: true,
        },
      ],
      order: [["count_view", "DESC"]],
      limit: perPage,
    });
    return data;
  };

  static videoList = async (id, page_size, page) => {
    let offset = (page - 1) * page_size;

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
            "(SELECT name FROM categories WHERE video.category_id = categories.id)"
          ),
          "category_name",
        ],
        [
          db.sequelize.literal(
            "(SELECT SUM(count_reply_comment)+COUNT(*) FROM comments WHERE video.id = comments.video_id)"
          ),
          "count_comment",
        ],
      ],
      where: {
        user_id: id,
      },
      limit: +page_size,
      offset: offset,
    });

    return {
      totalVideo: count,
      videos: rows,
    };
  };

  static deleteVideo = async (id, user_id) => {
    const videos = await db.video.findAll({
      where: {
        id,
        user_id,
      },
    });

    videos.forEach((video) => {
      const urlParts = video.dataValues.url.split("/");
      const videoId = urlParts[urlParts.length - 1];
      apiRequest(videoId, "delete");
      Cloudinary.deleteImageFromCloudinary(video.dataValues.thumbnail);
    });

    await db.video.destroy({
      where: {
        id,
        user_id,
      },
    });
  };

  static viewVideoOfUser = async (id, page, page_size) => {
    const queryCondition = this.addAdditionalInfoToVideo();
    const offset = (page - 1) * page_size;

    const userVideos = await db.video.findAll({
      where: {
        user_id: id,
        title: {
          [db.Sequelize.Op.ne]: null,
        },
        is_hide: {
          [db.Sequelize.Op.ne]: true,
        },
      },
      ...queryCondition,
      order: [["created_at", "DESC"]],
      limit: page_size,
      offset: offset,
    });

    return userVideos;
  };
}

module.exports = VideoService;
