import { Sequelize } from "sequelize";

const dbConfig = require("../config/database");
const Garage = require("./models/Garage");
const User = require("./models/User");
const Car = require("./models/Car");
const Transaction = require("./models/Transaction");

const sequelize = new Sequelize(
  dbConfig.Name,
  dbConfig.Username,
  dbConfig.Password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

class DbWrapper {
  static connect() {
    try {
      sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
  static updateSchemas(tableName: string) {
    switch (tableName) {
      case "User": {
        User.sync({ force: true });
        console.log("The table for the User model was just (re)created!");
        break;
      }
      case "Garage": {
        Garage.sync({ force: true });
        console.log("The table for the Garage model was just (re)created!");
        break;
      }
      case "Car": {
        Car.sync({ force: true });
        console.log("The table for the Car model was just (re)created!");
        break;
      }
      case "Transaction": {
        Transaction.sync({ force: true });
        console.log(
          "The table for the Transaction model was just (re)created!"
        );
        break;
      }
    }
  }
}

module.exports = DbWrapper;
