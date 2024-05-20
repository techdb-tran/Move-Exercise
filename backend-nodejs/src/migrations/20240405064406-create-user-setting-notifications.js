"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_setting_notifications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.BIGINT,
      },
      all_notifications: {
        type: Sequelize.BOOLEAN,
      },
      follow_notifications: {
        type: Sequelize.BOOLEAN,
      },
      comment_notifications: {
        type: Sequelize.BOOLEAN,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("user_setting_notifications", {
      type: "foreign key",
      fields: ["user_id"],
      name: "fk_user_setting_notifications_user_id",
      references: {
        table: "users",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_setting_notifications");
    await queryInterface.removeConstraint(
      "user_setting_notifications",
      "fk_user_setting_notifications_user_id"
    );
  },
};
