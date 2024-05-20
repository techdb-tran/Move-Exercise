"use strict";

const express = require("express");
const { asyncHandler } = require("../../middlewares");
const accessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.post("/login", asyncHandler(accessController.logIn));

router.post("/logout",authentication, asyncHandler(accessController.logout));

module.exports = router;
