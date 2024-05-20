"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reply_comments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      content: {
        type: Sequelize.TEXT,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      comment_id: {
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

    await queryInterface.addConstraint("reply_comments", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_reply_comment_user",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("reply_comments", {
      fields: ["comment_id"],
      type: "foreign key",
      name: "fk_reply_comment_comment",
      references: {
        table: "comments",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // await queryInterface.sequelize.query(`

    // CREATE TRIGGER update_count_reply_comment_trigger AFTER INSERT ON reply_comments
    // FOR EACH ROW
    // BEGIN
    //     UPDATE comments c
    //     SET c.count_reply_comment = (
    //         SELECT COUNT(*)
    //         FROM reply_comments rc
    //         WHERE rc.comment_id = c.id
    //     );
    // END;

    // `);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reply_comments");
  },
};
