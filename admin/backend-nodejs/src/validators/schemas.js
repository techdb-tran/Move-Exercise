const Joi = require("joi");

const id = Joi.number().integer().positive().required();

const querySchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  sort_by: Joi.string().allow(""),
  sort_order: Joi.string().valid("asc", "desc", "ASC", "DESC").allow(""),
  filter_country: Joi.string().allow(""),
  search: Joi.string().allow("").trim(),
});

const timeSchema = Joi.object({
  startDate: Joi.date(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
});

const createCategorySchema = Joi.object({
  name: Joi.string(),
  is_show: Joi.boolean().default(false),
});

const idSchema = Joi.object({
  id: id,
});

module.exports = {
  querySchema,
  timeSchema,
  createCategorySchema,
  idSchema,
};
