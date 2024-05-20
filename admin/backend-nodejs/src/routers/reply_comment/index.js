"use strict";

const express = require("express");
const { asyncHandler } = require("../../middlewares");
const { authentication } = require("../../auth/authUtils");
const replyCommentController = require("../../controllers/reply_comment.controller");
const router = express.Router();

router.delete(
  "/:id",
  authentication,
  asyncHandler(replyCommentController.deleteReplyComment)
);


module.exports = router;
