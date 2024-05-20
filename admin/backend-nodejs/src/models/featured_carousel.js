'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class featured_carousel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      featured_carousel.belongsTo(models.video, {foreignKey:"video_id"})
    }
  }
  featured_carousel.init(
    {
      video_id: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "featured_carousel",
      underscored: true,
    }
  );
  return featured_carousel;
};