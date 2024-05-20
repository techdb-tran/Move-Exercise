const app = require("./src/app");
const { envConfig } = require("./src/constants/config");
const PORT = envConfig.port || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", function () {
  server.close(() => {
    console.log("Server closed");
  });
});
