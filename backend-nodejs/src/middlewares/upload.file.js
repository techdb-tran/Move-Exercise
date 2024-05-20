const multer = require("multer");
const { REGEX } = require("../constants/regex");
const cloudinary = require("../config/connect.cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

class Upload {
  static storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "move_project/images",
    },
  });

  static imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(REGEX.IMAGE_REGEX)) {
      req.fileValidationError = "Only image files are allowed!";
      return cb(new Error("Only image files are allowed!"), false);
    }

    cb(null, true);
  };

  static upload = multer({
    storage: this.storage,
    fileFilter: this.imageFilter,
  });
}

module.exports = Upload;
