"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("followers", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      follower_user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      followed_user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
    await queryInterface.addConstraint("followers", {
      fields: ["follower_user_id"],
      type: "foreign key",
      name: "followers_user_id_fk",
      references: {
        table: "users",
        field: "id",
      },
    });

    await queryInterface.addConstraint("followers", {
      fields: ["followed_user_id"],
      type: "foreign key",
      name: "followers_followed_user_id_fk",
      references: {
        table: "users",
        field: "id",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("followers");
  },
};
