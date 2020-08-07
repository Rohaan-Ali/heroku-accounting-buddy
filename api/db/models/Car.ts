import { Sequelize, DataTypes, Model } from "sequelize";

const dbConfig = require("../../config/database");
const sequelize = new Sequelize(
  dbConfig.Name,
  dbConfig.Username,
  dbConfig.Password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

class Car extends Model {}

Car.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Make: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RegistrationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    IsPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    GarageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    IsDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    CreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Car",
    tableName: "Cars",
    timestamps: false,
  }
);

module.exports = Car;
