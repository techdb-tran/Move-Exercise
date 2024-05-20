"use strict";

const db = require("../models");

class ReplyCommentService {
  static findById = async (id) => {
    const data = await db.reply_comment.findOne({
      where: {
        id,
      },
    });
    return data;
  };

  static deleteReplyComment = async (id) => {
    await db.reply_comment.destroy({
      where: {
        id,
      },
    });
  };
}

module.exports = ReplyCommentService;
