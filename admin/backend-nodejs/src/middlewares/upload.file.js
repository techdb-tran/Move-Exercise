const multer = require("multer");
const { REGEX } = require("../constants/regex");
const cloudinary = require("../config/connect.cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { RES_MESSAGE } = require("../constants/message");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "move_project/admin",
  },
});

const imageFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(REGEX.IMAGE_REGEX)) {
    req.fileValidationError = RES_MESSAGE.ACCEPT_IMAGE_ONLY;
    return cb(new Error(RES_MESSAGE.ACCEPT_IMAGE_ONLY), false);
  }

  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

module.exports = upload;
