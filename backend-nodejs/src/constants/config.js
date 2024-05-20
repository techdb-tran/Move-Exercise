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
  port: process.env.PORT,
  googlePassword: process.env.GOOGLE_PASSWORD,
  googleEmail: process.env.GOOGLE_EMAIL,
  redisPort: process.env.REDIS_PORT,
  redisHost: process.env.REDIS_HOST,
  redisPassword: process.env.REDIS_PASSWORD,
  clientUrl: process.env.CLIENT_URL,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_KEY_SECRET,
  cloudinaryLinkPath: process.env.CLOUDINARY_LINK_PATH,
  vimeoClient: process.env.VIMEO_CLIENT,
  vimeoSecret: process.env.VIMEO_SECRET,
  vimeoAccess: process.env.VIMEO_ACCESS,
  yourApiKey: process.env.YOUR_API_KEY,
  countryStateCityApiUrl: process.env.COUNTRY_STATE_CITY_API_URL,
};

module.exports = {
  isProduction,
  envConfig,
};
