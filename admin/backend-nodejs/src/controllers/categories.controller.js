"use strict";

const { RES_MESSAGE } = require("../constants/message");
const { CREATED, OK, UPDATED } = require("../core/success.response");
const CategoryService = require("../services/categories.service");

const PAGE = 1;
const LIMIT = 15;

class CategoryController {
  overView = async (req, res, next) => {
    const { startDate, endDate } = req.query;
    new OK({
      metadata: await CategoryService.countCategoryView(startDate, endDate),
    }).send(res);
  };

  categoriesList = async (req, res) => {
    const { page, limit, sort_by, sort_order, search } = req.validatedData;
    new OK({
      metadata: await CategoryService.getCategories({
        page: +page || PAGE,
        limit: +limit || LIMIT,
        sort_by,
        sort_order,
        search,
      }),
    }).send(res);
  };

  createCategory = async (req, res) => {
    const { name, is_show } = req.validatedData;
    const image_url = req.file.path;
    new CREATED({
      metadata: await CategoryService.createCategory(name, is_show, image_url),
    }).send(res);
  };

  editCategory = async (req, res) => {
    const { id } = req.params;
    const { name, is_show } = req.validatedData;
    const image_url = req.file?.path;

    new OK({
      message: RES_MESSAGE.UPDATED_SUCCESSFULLY,
      metadata: await CategoryService.editCategory({
        id,
        name,
        is_show,
        image_url,
      }),
    }).send(res);
  };

  categoryInfo = async (req, res) => {
    const { id } = req.validatedData;
    new OK({
      metadata: await CategoryService.findCategoryById(id),
    }).send(res);
  };
}

module.exports = new CategoryController();
