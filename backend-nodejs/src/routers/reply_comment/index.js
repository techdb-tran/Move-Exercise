"use strict";

const express = require("express");
const { asyncHandler } = require("../../helper/async.handler");
const { authentication } = require("../../auth/authUtils");
const replyCommentController = require("../../controllers/reply_comments.controller");
const router = express.Router();

router.delete(
  "/:id",
  authentication,
  asyncHandler(replyCommentController.deleteReplyComment)
);


module.exports = router;
