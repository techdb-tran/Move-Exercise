"use strict";

const { Sequelize, Op } = require("sequelize");
const db = require("../models");
const { BAD_REQUEST, NOT_FOUND } = require("../core/error.response");
const { RES_MESSAGE } = require("../constants/message");
const { deleteImageFromCloudinary } = require("../utils/cloudinary");

class CategoryService {
  static findCategoryById = async (categoryId) => {
    return db.Category.findByPk(categoryId);
  };

  static countCategoryView = async (startDate, endDate) => {
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
            `(SELECT SUM(count_view) FROM videos WHERE Category.id = videos.category_id AND created_at BETWEEN '${startDate}' AND '${endDate}')`
          ),
          "count_views",
        ],
      ],
    });
    return data;
  };

  static getCategories = async ({
    search,
    page,
    limit,
    sort_by = "id",
    sort_order = "ASC",
  }) => {
    const whereCondition = {};
    if (search) {
      whereCondition.name = {
        [Op.like]: `%${search}%`,
      };
    }

    const offset = (page - 1) * limit;

    const categories = await db.Category.findAndCountAll({
      where: whereCondition,
      attributes: [
        "id",
        "name",
        "image_url",
        "created_at",
        "updated_at",
        "is_show",
        [
          Sequelize.literal(
            "(SELECT SUM(count_view) FROM videos WHERE videos.category_id = Category.id)"
          ),
          "total_views",
        ],
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM user_follower_categories WHERE user_follower_categories.category_id = Category.id)"
          ),
          "total_followers",
        ],
      ],
      limit,
      offset,
      order: [[sort_by, sort_order]],
    });

    const totalPages = Math.ceil(categories.count / limit);

    return {
      totalCategories: categories.count,
      totalPages: totalPages,
      currentPage: page,
      categories: categories.rows,
    };
  };

  static createCategory = async (name, isShow, imageUrl) => {
    const existingCategory = await db.Category.findOne({ where: { name } });
    if (existingCategory) {
      if (imageUrl) {
        await deleteImageFromCloudinary(imageUrl);
      }
      throw new BAD_REQUEST(RES_MESSAGE.CATEGORY_NAME_ALREADY_EXIST);
    }

    return db.Category.create({
      name,
      image_url: imageUrl,
      is_show: !!isShow,
    });
  };

  static editCategory = async ({ id, name, is_show, image_url }) => {
    const category = await this.findCategoryById(id);

    if (!category) throw new NOT_FOUND(RES_MESSAGE.CATEGORY_NOT_FOUND);

    if (category.name === name)
      throw new BAD_REQUEST(RES_MESSAGE.CATEGORY_NAME_ALREADY_EXIST);

    const imageUrl = image_url || category.image_url;

    const updatedCategory = await category.update({
      name,
      is_show,
      image_url: imageUrl,
    });

    if (!updatedCategory.is_show) {
      await db.video.update(
        { is_hide: true },
        { where: { category_id: id, is_hide: false } }
      );
    } else {
      const videosToUpdate = await db.video.findAll({
        where: { category_id: id, is_hide: true },
      });
      for (const video of videosToUpdate) {
        const userBan = await db.user_ban.findOne({
          where: { user_id: video.user_id },
        });
        if (
          !userBan ||
          (!userBan.is_permaban &&
            (userBan.ban_expired_at === null ||
              new Date(userBan.ban_expired_at) < new Date()))
        ) {
          await video.update({ is_hide: false });
        }
      }
    }

    return updatedCategory;
  };
}

module.exports = CategoryService;
