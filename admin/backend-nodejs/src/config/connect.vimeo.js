const { envConfig } = require("../constants/config");

const Vimeo = require("vimeo").Vimeo;

const client = new Vimeo(envConfig.vimeoClient, envConfig.vimeoSecret, envConfig.vimeoAccess);


const apiRequest = (video_id, method) =>
  client.request(
    {
      method,
      path: `/videos/${video_id}`,
      headers: {
        "Content-Type": "application/json",
      },
    },
    (error, body) => {
      if (error) {
        console.log(error);
      } else {
        return
      }
    }
  );

module.exports = apiRequest