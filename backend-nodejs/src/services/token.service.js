"use strict";

const db = require("../models");

class KeyTokenService {
  static createKeyToken = async ({ user_id, browse_id, public_key }) => {
    try {
      const token = await db.token.findOne({
        where: [
          {
            user_id,
            browse_id,
          },
        ],
      });
      if (!token) {
        return db.token.create({
          user_id,
          browse_id,
          public_key,
        });
      }
      token.public_key = public_key;
      await token.save();
      return;
    } catch (error) {
      return {
        error: error.message,
      };
    }
  };

  static findByUserIdAndUserAgent = async (user_id, browse_id) => {
    return await db.token.findOne({ where: { user_id, browse_id } });
  };

  static removeKeyById = async (user_id, browse_id) => {
    return await db.token.destroy({
      where: { user_id, browse_id },
    });
  };
}
module.exports = KeyTokenService;
