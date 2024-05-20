"use strict";

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
}

module.exports = FeaturedCarouselService;
