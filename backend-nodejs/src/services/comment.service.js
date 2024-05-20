"use strict";

const db = require("../models");

class CommentService {
  static findById = async (id, user_id) => {
    const data = await db.comment.findOne({
      where: {
        id,
        user_id,
      },
    });
    return data;
  };

  static deleteComment = async (id, user_id) => {
    await db.comment.destroy({
      where: {
        id,
        user_id,
      },
    });
  };
}

module.exports = CommentService;
