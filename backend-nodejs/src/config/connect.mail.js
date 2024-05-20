"use strict";

const nodemailer = require("nodemailer");
const { SERVICE_UNAVAILABLE } = require("../core/error.response");
const { envConfig } = require("../constants/config");
const createTransporter = async () => {
    try {
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: envConfig.googleEmail,
                pass: envConfig.googlePassword,
            },
        });
        return transport;
    } catch (error) {
        throw new SERVICE_UNAVAILABLE(
            "Could not create transport for email service."
        );
    }
};

module.exports = createTransporter;
