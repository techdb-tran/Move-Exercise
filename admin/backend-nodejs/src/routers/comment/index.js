"use strict";

const express = require("express");
const { asyncHandler } = require("../../middlewares");
const { authentication } = require("../../auth/authUtils");
const commentController = require("../../controllers/comment.controller");
const router = express.Router();

router.delete(
  "/:id",
  authentication,
  asyncHandler(commentController.deleteComment)
);


module.exports = router;
