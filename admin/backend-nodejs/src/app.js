const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/connect.db");
const cors = require("cors");
const { RES_MESSAGE } = require("./constants/message");
const Cloudinary = require("./utils/cloudinary");
const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
connectDB();
app.use(cors());
require("./config/connect.redis");

app.use("/admin/v1/api", require("./routers/index"));

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  if (req.file) {
    Cloudinary.deleteImageFromCloudinary(req.file.path);
  }
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || RES_MESSAGE.SERVER_ERROR,
  });
});

module.exports = app;
