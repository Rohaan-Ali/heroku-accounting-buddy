import { Sequelize } from "sequelize";

const Configuration = require("config");

const sequelize = new Sequelize(
  Configuration.get("database.Name"),
  Configuration.get("database.Username"),
  Configuration.get("database.Password"),
  {
    host: Configuration.get("database.Host"),
    dialect: Configuration.get("database.dialect"),
    dialectOptions: {
      ssl: {
        require:true,
        rejectUnauthorized : false,
      }
    }
  }
);

module.exports = sequelize;
