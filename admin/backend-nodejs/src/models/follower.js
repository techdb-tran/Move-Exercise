"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class follower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      follower.belongsTo(models.user, { foreignKey: "followed_user_id" });
    }
  }
  follower.init(
    {
      follower_user_id: DataTypes.BIGINT,
      followed_user_id: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "follower",
      underscored: true,
    }
  );
  return follower;
};
