"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("view_videos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      video_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "videos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      time: {
        type: Sequelize.BIGINT,
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

    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_count_view_trigger AFTER INSERT ON view_videos
      FOR EACH ROW
      BEGIN
        UPDATE videos v
        SET v.count_view = (
          SELECT COUNT(*)
          FROM view_videos vv
          WHERE vv.video_id = v.id
        );
      END;
    `);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("view_videos");
  },
};
