"use strict";

const { RES_MESSAGE } = require("../constants/message");
const { CONFLICT, NOT_FOUND } = require("../core/error.response");
const db = require("../models/index");
const { Sequelize } = require("sequelize");

class FeaturedCarouselService {
  static find = async () => {
    const data = await db.featured_carousel.findAll({
      attributes: [],
      include: [
        {
          model: db.video,
          attributes: [
            "id",
            "title",
            "description",
            "thumbnail",
            "created_at",
            "updated_at",
            "user_id",
            "category_id",
            "keyword",
            "is_comment",
            "is_exist",
            "duration",
            "url",
            "count_view",
            "level",
            [
              db.sequelize.literal(
                "(SELECT SUM(rate)/COUNT(*) FROM rate_videos WHERE video.id = rate_videos.video_id)"
              ),
              "average_rates",
            ],
          ],
          required: true,
          include: [
            {
              model: db.user,
              attributes: { exclude: ["password"] },
              required: true,
            },
            {
              model: db.Category,
              attributes: ["name"],
            },
          ],
        },
      ],
    });
    return data;
  };

  static addFeaturedVideo = async (id) => {
    const featuredVideos = await this.findById(id)

    if (featuredVideos) {
      throw new CONFLICT(RES_MESSAGE.VIDEO_ALREADY_EXISTS)
    }

    await db.featured_carousel.create({
      video_id: id,
    });
  };

  static removeFeaturedVideo = async (id) => {
    const featuredVideos = await this.findById(id)

    if (!featuredVideos) {
      throw new NOT_FOUND(RES_MESSAGE.NOT_FOUND_FEATURED_VIDEOS);
    }

    await db.featured_carousel.destroy({
      where: {
        video_id: id,
      },
    });
  };

  static findById = async (id) => { 
    const data = await db.featured_carousel.findOne({
      where: {
        video_id: id,
      },
    });
    return data;
  }
}

module.exports = FeaturedCarouselService;
