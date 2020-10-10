import { Sequelize } from "sequelize";

const dbConfig = require("../config/database");

const sequelize = new Sequelize(
  dbConfig.Name,
  dbConfig.Username,
  dbConfig.Password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

module.exports = sequelize;
