"use strict";

const { RES_MESSAGE } = require("../constants/message");
const { NOT_FOUND } = require("../core/error.response");
const { CREATED, OK, UPDATED } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  deleteComment = async (req, res, next) => {
    const commentId = req.params.id;

    const comment = await CommentService.findById(commentId);

    if (!comment) {
      throw new NOT_FOUND(RES_MESSAGE.COMMENT_NOT_FOUND)
    }

    new OK({
      metadata: await CommentService.deleteComment(commentId),
    }).send(res);
  };
}

module.exports = new CommentController();
