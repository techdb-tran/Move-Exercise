"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class reply_comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      reply_comment.belongsTo(models.comment, { foreignKey: "comment_id" });
    }
  }
  reply_comment.init(
    {
      content: DataTypes.TEXT,
      user_id: DataTypes.BIGINT,
      comment_id: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "reply_comment",
      underscored: true,
    }
  );
  return reply_comment;
};
