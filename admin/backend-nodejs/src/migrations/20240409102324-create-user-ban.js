"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user-bans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          table: "users",
          key: "id",
        },
      },
      is_permaban: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      ban_expired_at: {
        type: Sequelize.DATE,
        allowNull: false,
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

    await queryInterface.addConstraint("user-bans", {
      fields: ["user_id"],
      type: "unique",
      name: "unique_user_id",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user-bans");
  },
};
