"use strict";

const { OK } = require("../core/success.response");
const CategoriesService = require("../services/categories.service");

class CategoriesController {
  view = async (req, res, next) => {
    new OK({
      metadata: await CategoriesService.findCategoriesShow(),
    }).send(res);
  };

  categoryInfo = async (req, res) => {
    new OK({
      metadata: await CategoriesService.getCategoryInfo(req.params.cate_id),
    }).send(res);
  };

  followCategory = async (req, res) => {
    const { user_id } = req.key_store;
    new OK({
      metadata: await CategoriesService.followCategory(
        user_id,
        req.body.cate_id || []
      ),
    }).send(res);
  };
}

module.exports = new CategoriesController();
