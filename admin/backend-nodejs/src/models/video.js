"use strict";
const { Model } = require("sequelize");
const { VideoLevelEnum, VideoDurationEnum } = require("../constants/enums");

module.exports = (sequelize, DataTypes) => {
  class video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      video.belongsTo(models.Category, { foreignKey: "category_id" });
      video.belongsTo(models.user, { foreignKey: "user_id" });
    }
  }
  video.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      thumbnail: DataTypes.TEXT,
      url: DataTypes.TEXT,
      user_id: DataTypes.BIGINT,
      category_id: DataTypes.BIGINT,
      keyword: DataTypes.TEXT,
      is_comment: DataTypes.BOOLEAN,
      level: {
        type: DataTypes.ENUM(...Object.values(VideoLevelEnum)),
        allowNull: false,
      },
      duration: DataTypes.ENUM(...Object.values(VideoDurationEnum)),
      is_exist: DataTypes.BOOLEAN,
      duration_time: DataTypes.INTEGER,
      count_view: DataTypes.BIGINT,
      is_hide: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "video",
      tableName: "videos",
      underscored: true,
    }
  );

  return video;
};
