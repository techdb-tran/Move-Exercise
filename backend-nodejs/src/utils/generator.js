"use strict";

const otp = require("otp-generator");

class Generator {
  static codeGenerator = ({
    length,
    digits,
    lowerCaseAlphabets,
    upperCaseAlphabets,
    specialChars,
  }) => {
    return otp.generate(length, {
      digits,
      lowerCaseAlphabets,
      upperCaseAlphabets,
      specialChars,
    });
  };

  static tokenGenerator = () => {
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    return privateKey, publicKey;
  };
}

module.exports = Generator;
