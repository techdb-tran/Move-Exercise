const Joi = require("joi");
const { REGEX } = require("../constants/regex");
const { RES_MESSAGE } = require("../constants/message");

const id = Joi.number().integer().positive().required();
const page = Joi.number().integer().min(1).allow("");
const pageSize = Joi.number().integer().min(1).allow("");
const email = Joi.string().trim().email().required();
const date = Joi.date().iso().allow("");

// Schema for set up profile
const setupProfileSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .pattern(new RegExp(REGEX.USER_NAME_REGEX)),
  fullname: Joi.string().trim().min(3).max(255),
  gender: Joi.valid("male", "female", "other"),
  birthday: date,
  country: Joi.string().trim(),
  state: Joi.string().trim(),
  city: Joi.string().trim(),
  avatar_url: Joi.allow(),
});

// Schema for forgot password
const forgotPasswordSchema = Joi.object({
  email: email,
});

const resetPasswordBodySchema = Joi.object({
  password: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp(REGEX.PASSWORD_REGEX))
    .messages({
      "string.pattern.base": RES_MESSAGE.WRONG_PASSWORD_FORMAT,
    }),
});

const resetPasswordParamsSchema = Joi.object({
  token: Joi.string().alphanum().length(30),
});

const signUpAndLoginSchema = Joi.object({
  email: email,
  password: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp(REGEX.PASSWORD_REGEX))
    .messages({
      "string.pattern.base": RES_MESSAGE.WRONG_PASSWORD_FORMAT,
    }),
});

const generalInfoParamsSchema = Joi.object({
  user_id: id,
});

const watchAlsoParamsSchema = Joi.object({
  video_id: id,
});

const videoYouMayLikeQuerySchema = Joi.object({
  page: page,
});

const followUserSchema = Joi.object({
  user_id: id,
});

const videoListSchema = Joi.object({
  page: page,
  page_size: pageSize,
});

const topVideosQuerySchema = Joi.object({
  category: Joi.string().allow(""),
  level: Joi.string().allow(""),
  sort_by: Joi.string()
    .valid("total_view", "duration_time", "average_rates", "most_recent")
    .allow(""),
  sort_order: Joi.string().valid("ASC", "DESC").allow(""),
  page: page,
  page_size: pageSize,
});

const categoryIdParamsSchema = Joi.object({
  cate_id: id,
});

const videoListOfCategoryQuerySchema = Joi.object({
  sort_by: Joi.string()
    .valid("total_view", "duration_time", "average_rates", "most_recent")
    .allow(""),
  sort_order: Joi.string().valid("ASC", "DESC").allow(""),
  level: Joi.string().allow(""),
  page: page,
  page_size: pageSize,
});

const setupNotificationsBodySchema = Joi.object({
  follow_notifications: Joi.boolean().required(),
  comment_notifications: Joi.boolean().required(),
});

const getAllNotiQuerySchema = Joi.object({
  page: page,
  page_size: pageSize,
});

const videoAnalyticsQuerySchema = Joi.object({
  page: page,
  page_size: pageSize,
  sort_by: Joi.string()
    .valid(
      "percentage_viewed",
      "average_rates",
      "average_view_time",
      "views",
      "all_status"
    )
    .allow(""),
  sort_order: Joi.string().valid("ASC", "DESC", "asc", "desc").allow(""),
  start_date: date,
  end_date: date,
});

const paginationQuerySchema = Joi.object({
  page: page,
  page_size: pageSize,
});

const videoIdSchema = Joi.object({
  video_id: id,
});

const daysAgoSchema = Joi.object({
  days_ago: Joi.number().integer().min(0).allow(null),
});

const analyzeStateViewsQuerySchema = Joi.object({
  days_ago: Joi.number().integer().min(0).allow(null),
  country_code: Joi.string().allow(null),
});

module.exports = {
  setupProfileSchema,
  forgotPasswordSchema,
  resetPasswordBodySchema,
  signUpAndLoginSchema,
  generalInfoParamsSchema,
  watchAlsoParamsSchema,
  resetPasswordParamsSchema,
  topVideosQuerySchema,
  categoryIdParamsSchema,
  videoYouMayLikeQuerySchema,
  followUserSchema,
  videoListSchema,
  videoListOfCategoryQuerySchema,
  setupNotificationsBodySchema,
  getAllNotiQuerySchema,
  videoAnalyticsQuerySchema,
  paginationQuerySchema,
  videoIdSchema,
  daysAgoSchema,
  analyzeStateViewsQuerySchema,
};
