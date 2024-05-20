"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.video, { foreignKey: "category_id" });
      Category.hasMany(models.UserFollowerCategory, {
        foreignKey: "category_id",
      });
    }
  }
  Category.init(
    {
      name: DataTypes.STRING,
      is_show: DataTypes.BOOLEAN,
      image_url: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Category",
      modelTable: "categories",
      underscored: true,
    }
  );
  return Category;
};
