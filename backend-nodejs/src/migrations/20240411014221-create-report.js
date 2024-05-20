"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("reports", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      reported_user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      type_report_id: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      status: {
        type: Sequelize.ENUM([
          "Pending",
          "UnderReview",
          "Processing",
          "Resolved",
          "Rejected",
        ]),
      },
      deleted_at: {
        type: Sequelize.DATE,
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
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
