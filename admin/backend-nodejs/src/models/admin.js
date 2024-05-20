'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  admin.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.TEXT,
      public_key: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "admin",
      underscored: true,
    }
  );
  return admin;
};