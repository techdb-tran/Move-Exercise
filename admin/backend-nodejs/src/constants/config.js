"use strict";

const { config } = require("dotenv");
const argv = require("minimist");
const options = argv(process.argv.slice(2));

const isProduction = options.env === "production";
config({
  path: options.env ? `.env.${options.env} ` : ".env",
});

const envConfig = {
  dbUserName: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbDatabase: process.env.DB_DATABASE,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  serverUrl: process.env.SERVER_URL,
  port: process.env.PORT,
  redisPassword: process.env.REDIS_PASSWORD,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  vimeoClient: process.env.VIMEO_CLIENT,
  vimeoSecret: process.env.VIMEO_SECRET,
  vimeoAccess: process.env.VIMEO_ACCESS,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_KEY_SECRET,
  countryStateCityApiUrl: process.env.COUNTRY_STATE_CITY_API_URL,
};

module.exports = {
  isProduction,
  envConfig,
};
