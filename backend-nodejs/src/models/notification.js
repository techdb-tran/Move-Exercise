"use strict";
const { Model } = require("sequelize");
const { NotificationTypeEnum } = require("../constants/enums");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Notification.belongsTo(models.user, { foreignKey: "user_id_to" });
      Notification.belongsTo(models.user, { foreignKey: "user_id_from" });
    }
  }
  Notification.init(
    {
      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      notification_type: {
        type: DataTypes.ENUM(...Object.values(NotificationTypeEnum)),
        allowNull: false,
      },
      user_id_from: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      user_id_to: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      notification_content_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Notification",
      underscored: true,
    }
  );
  return Notification;
};
