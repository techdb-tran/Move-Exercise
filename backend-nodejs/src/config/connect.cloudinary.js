const { envConfig } = require("../constants/config");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: envConfig.cloudinaryCloudName,
  api_key: envConfig.cloudinaryApiKey,
  api_secret: envConfig.cloudinaryApiSecret,
});

module.exports = cloudinary;
