"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasMany(models.follower, { foreignKey: "follower_user_id" });
      user.hasMany(models.video, { foreignKey: "user_id" });
      user.hasOne(models.user_ban, { foreignKey: "user_id" });
      user.hasMany(models.RateVideo, { foreignKey: "video_id" });
    }
  }
  user.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.TEXT,
      username: DataTypes.STRING,
      fullname: DataTypes.STRING,
      gender: DataTypes.STRING,
      birthday: DataTypes.DATE,
      country: DataTypes.STRING,
      state: DataTypes.STRING,
      city: DataTypes.STRING,
      is_verified: DataTypes.BOOLEAN,
      is_actived: DataTypes.BOOLEAN,
      avatar_url: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "user",
      underscored: true,
    }
  );
  return user;
};
