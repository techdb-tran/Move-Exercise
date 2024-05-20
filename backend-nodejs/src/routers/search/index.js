"use strict";

const express = require("express");
const { asyncHandler } = require("../../helper/async.handler");
const searchsController = require("../../controllers/searchs.controller");
const router = express.Router();

router.get("/", asyncHandler(searchsController.instantSearch));

router.get("/result", asyncHandler(searchsController.searchResult));

module.exports = router;
