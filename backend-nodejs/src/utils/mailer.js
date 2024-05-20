"use strict";

const createTransporter = require("../config/connect.mail");
const { SERVICE_UNAVAILABLE } = require("../core/error.response");

class Mailer {
  static sendMail = async (email, subject, html) => {
    try {
      const mailOptions = {
        to: email,
        subject: subject,
        html: html,
      };

      const emailTransporter = await createTransporter();
      await emailTransporter.sendMail(mailOptions);
      console.log("Email sent successfully.");
    } catch (err) {
      throw new SERVICE_UNAVAILABLE("Could not send the email.");
    }
  };
}

module.exports = Mailer;
