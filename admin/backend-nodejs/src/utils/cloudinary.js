const cloudinary = require("../config/connect.cloudinary");
const { RES_MESSAGE } = require("../constants/message");

class Cloudinary {
  static getPublicIdFromUrl = (url) => {
    const parts = url.split("/");

    const filenameWithExtension = parts[parts.length - 1];

    const publicId = filenameWithExtension.split(".")[0];

    let publicIdFull =
      parts.slice(parts.indexOf("upload") + 2, parts.length - 1).join("/") +
      "/" +
      publicId;

    if (publicIdFull.charAt(0) === "/") {
      publicIdFull = publicIdFull.slice(1);
    }

    return publicIdFull;
  };

  static deleteImageFromCloudinary = async (imageUrl) => {
    try {
      const publicId = this.getPublicIdFromUrl(imageUrl);
      // delete from Cloudinary
      const result = await cloudinary.uploader.destroy(publicId);

      console.log(`${RES_MESSAGE.IMAGE_HAS_BEEN_DELETED} ${publicId}`);
      return result;
    } catch (error) {
      console.error(`${RES_MESSAGE.DELETE_IMAGE_ERR} ${error.message}`);
    }
  };
}

module.exports = Cloudinary;
