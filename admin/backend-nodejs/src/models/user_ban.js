"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_ban extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_ban.belongsTo(models.user, {
        foreignKey: "user_id",
      });
    }
  }
  User_ban.init(
    {
      user_id: DataTypes.BIGINT,
      is_permaban: DataTypes.BOOLEAN,
      ban_expired_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "user_ban",
      underscored: true,
    }
  );
  return User_ban;
};
