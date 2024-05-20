"use strict";

const db = require("../models/index");
const { Sequelize, Op } = require("sequelize");

class CategoriesService {
  static findCategoriesShow = async () => {
    const data = await db.Category.findAll({
      where: {
        is_show: 1,
      },
      attributes: [
        "id",
        "name",
        "image_url",
        [
          db.sequelize.literal(
            "(SELECT SUM(count_view) FROM videos WHERE Category.id = videos.category_id AND videos.is_hide = false)"
          ),
          "count_views",
        ],
      ],
    });
    return data;
  };

  static searchCategories = async (searchTerm) => {
    const data = await db.Category.findAll({
      attributes: [
        "id",
        "name",
        "image_url",
        [
          db.sequelize.literal(
            "(SELECT SUM(count_view) FROM videos WHERE Category.id = videos.category_id)"
          ),
          "count_views",
        ],
      ],
      where: {
        name: {
          [Op.like]: `%${searchTerm}%`,
        },
        is_show: 1,
      },
      limit: 5,
    });
    return data;
  };

  static getCategoryInfo = async (cat_id) => {
    const category = await db.Category.findOne({
      where: { id: cat_id, is_show: 1 },
      attributes: [
        "id",
        "name",
        "image_url",
        [
          db.sequelize.literal(
            "(SELECT SUM(count_view) FROM videos WHERE Category.id = videos.category_id AND videos.is_hide = false AND title IS NOT NULL AND duration_time IS NOT NULL)"
          ),
          "total_views",
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM user_follower_categories WHERE category_id = ${cat_id})`
          ),
          "total_followers",
        ],
      ],
      // include: [
      //   {
      //     model: db.video,
      //     attributes: [],
      //     where: {
      //       title: {
      //         [Op.ne]: null,
      //       },
      //       duration_time: {
      //         [Op.ne]: null,
      //       },
      //       is_hide: false,
      //     },
      //   },
      // ],
      // group: ["Category.id"],
    });

    return category;
  };

  static followAllCategory = async (user_id) => {
    const categories = await db.Category.findAll({
      attributes: ["id"],
    });

    const data = categories.map((category) => ({
      user_id,
      category_id: category.id,
    }));

    await db.UserFollowerCategory.bulkCreate(data);
  };

  static followCategory = async (user_id, category_id) => {
    await db.UserFollowerCategory.destroy({
      where: {
        user_id,
        category_id: {
          [Op.notIn]: category_id,
        },
      },
    });
  };
}

module.exports = CategoriesService;
