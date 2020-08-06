import express from "express";
import { Sequelize } from "sequelize";

// const Garage = require("./db/models/Garage");
// Garage.updateSchema();
// const User = require("./db/models/User");
// User.updateSchema();
// const Car = require("./db/models/Car");
// Car.updateSchema();
// const Transaction = require("./db/models/Transaction");
// Transaction.updateSchema();

const app = express();

const sequelize = new Sequelize("AccountingBuddy", "postgres", "bcsf13m015", {
  host: "localhost",
  dialect: "postgres",
});

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.listen(5000, () => console.log("Server Started!"));
