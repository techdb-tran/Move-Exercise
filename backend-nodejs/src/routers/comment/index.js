"use strict";

const express = require("express");
const { asyncHandler } = require("../../helper/async.handler");
const { authentication } = require("../../auth/authUtils");
const commentController = require("../../controllers/comments.controller");
const router = express.Router();

router.delete(
  "/:id",
  authentication,
  asyncHandler(commentController.deleteComment)
);


module.exports = router;
