"use strict";

const { RES_MESSAGE } = require("../constants/message");
const { NOT_FOUND } = require("../core/error.response");
const { CREATED, OK, UPDATED } = require("../core/success.response");
const ReplyCommentService = require("../services/reply_comment.service");

class ReplyCommentController {
  deleteReplyComment = async (req, res, next) => {
    const commentId = req.params.id;

    const comment = await ReplyCommentService.findById(commentId);

    if (!comment) {
      throw new NOT_FOUND(RES_MESSAGE.COMMENT_NOT_FOUND);
    }

    new OK({
      metadata: await ReplyCommentService.deleteReplyComment(commentId),
    }).send(res);
  };
}

module.exports = new ReplyCommentController();
