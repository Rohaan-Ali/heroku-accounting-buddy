const Garage = require("./models/Garage");
const User = require("./models/User");
const Car = require("./models/Car");
const Transaction = require("./models/Transaction");
const sequelize = require("./sequelize");

class DbWrapper {
  static async connect() {
    try {
      await sequelize.authenticate();
      console.log("Database connection has been established successfully.");
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
