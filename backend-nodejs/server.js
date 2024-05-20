const app = require("./src/app");
const { envConfig } = require("./src/constants/config");
const PORT = envConfig.port;
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", function () {
    server.close(() => {
        console.log("Server closed");
    });
});
