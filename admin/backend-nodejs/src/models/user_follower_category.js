"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserFollowerCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserFollowerCategory.belongsTo(models.Category, {
        foreignKey: "category_id",
      });

      UserFollowerCategory.belongsTo(models.user, {
        foreignKey: "user_id",
      });
    }
  }
  UserFollowerCategory.init(
    {
      category_id: DataTypes.INTEGER,
      user_id: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "UserFollowerCategory",
      underscored: true,
    }
  );
  return UserFollowerCategory;
};
