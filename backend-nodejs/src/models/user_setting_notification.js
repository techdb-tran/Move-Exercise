"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserSettingNotification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserSettingNotification.belongsTo(models.user, { foreignKey: "user_id" });
    }
  }
  UserSettingNotification.init(
    {
      user_id: DataTypes.BIGINT,
      follow_notifications: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      comment_notifications: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "UserSettingNotification",
      underscored: true,
    }
  );
  return UserSettingNotification;
};
