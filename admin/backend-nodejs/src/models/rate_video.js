"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RateVideo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RateVideo.init(
    {
      user_id: DataTypes.BIGINT,
      rate: DataTypes.INTEGER,
      video_id: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "RateVideo",
      underscored: true,
    }
  );
  return RateVideo;
};
