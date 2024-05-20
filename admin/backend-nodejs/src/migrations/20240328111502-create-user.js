"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(50),
      },
      fullname: {
        type: Sequelize.STRING(255),
      },
      gender: {
        type: Sequelize.ENUM(["male", "female", "other"]),
      },
      birthday: {
        type: Sequelize.DATE,
      },
      country: {
        type: Sequelize.STRING(25),
      },
      city: {
        type: Sequelize.STRING(25),
      },
      state: {
        type: Sequelize.STRING(100),
      },
      avatar_url: {
        type: Sequelize.TEXT,
      },
      is_actived: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
