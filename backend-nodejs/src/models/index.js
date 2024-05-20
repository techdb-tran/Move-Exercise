"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const { envConfig } = require("../constants/config");
const basename = path.basename(__filename);
const db = {};

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
fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js" &&
            file.indexOf(".test.js") === -1
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
