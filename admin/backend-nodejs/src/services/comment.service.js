"use strict";

const db = require("../models");

class CommentService {
  static findById = async (id) => { 
    const data = await db.comment.findOne({
      where: {
        id,
      },
    });
    return data;
  }

  static deleteComment = async (id) => { 
    await db.comment.destroy({
      where: {
        id,
      },
    });
  }
}

module.exports = CommentService;