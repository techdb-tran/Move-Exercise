"use strict";

const { createClient } = require("redis");
const { envConfig } = require("../constants/config");

const client = createClient({
  url:
    "redis://default:" +
    envConfig.redisPassword +
    "@" +
    envConfig.redisHost +
    ":" +
    envConfig.redisPort,
});

client.connect();

client.on("connect", () => {
  console.log("Redis is Connected!");
});

client.on("error", (err) => {});

client.on("end", () => {});
client.on("reconnecting", () => {});

module.exports = client;
