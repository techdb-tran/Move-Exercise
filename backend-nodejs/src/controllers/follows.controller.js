"use strict";

const { OK } = require("../core/success.response");
const FollowsService = require("../services/follows.service");

const PAGE = 1;
const LIMIT = 20;

class FollowsController {
  followedChannnels = async (req, res) => {
    const { page, page_size } = req.validatedData;

    new OK({
      metadata: await FollowsService.getFollowedChannels(
        req.key_store.user_id,
        page || PAGE,
        page_size || LIMIT
      ),
    }).send(res);
  };

  followUser = async (req, res, next) => {
    const { user_id } = req.key_store;
    new OK({
      metadata: await FollowsService.followUser(user_id, req.params.user_id),
    }).send(res);
  };

  getFollowUser = async (req, res, next) => {
    const { user_id } = req.key_store;
    new OK({
      metadata: await FollowsService.getFollowUser(user_id, req.params.user_id),
    }).send(res);
  };

  checkFollowCategory = async (req, res, next) => {
    const { user_id } = req.key_store;
    new OK({
      metadata: await FollowsService.checkFollowCategory(
        user_id,
        req.params.cate_id
      ),
    }).send(res);
  };

  followCategory = async (req, res) => {
    const { user_id } = req.key_store;
    new OK({
      metadata: await FollowsService.followCategory(
        user_id,
        req.params.cate_id
      ),
    }).send(res);
  };
}

module.exports = new FollowsController();
