"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ViewVideo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ViewVideo.belongsTo(models.user, {
        foreignKey: "user_id",
        targetKey: "id",
      });
    }
  }
  ViewVideo.init(
    {
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      video_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "video",
          key: "id",
        },
      },
      time: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ViewVideo",
      underscored: true,
    }
  );
  return ViewVideo;
};
