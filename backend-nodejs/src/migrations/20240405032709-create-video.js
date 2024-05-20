"use strict";

const { envConfig } = require("../constants/config");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("videos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      thumbnail: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: `${envConfig.cloudinaryLinkPath}v1715527494/move_project/images/videos/nyrjnhrpavo9yjpsszy3.png`,
      },
      url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.BIGINT,
      },
      keyword: {
        type: Sequelize.TEXT,
      },
      is_comment: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      level: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      duration: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      is_exist: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.addColumn("videos", "count_view", {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    });

    await queryInterface.sequelize.query(`
    CREATE TRIGGER trigger_check_hide AFTER UPDATE ON videos
    FOR EACH ROW
    BEGIN
    IF NEW.is_hide = 1 THEN
        DELETE FROM move_project.featured_carousels WHERE video_id = NEW.id;
    END IF;
    END;
    `);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("videos");
  },
};
