const { Sequelize } = require("sequelize");
const { envConfig } = require("../constants/config");
const sequelize = new Sequelize(
  envConfig.dbDatabase,
  envConfig.dbUserName,
  envConfig.dbPassword,
  {
    host: envConfig.dbHost,
    dialect: "mysql",
    logging: false,
    port: envConfig.dbPort,
    timezone: "+07:00",
  }
);
async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

module.exports = connectToDatabase;
