import { Sequelize, DataTypes, Model } from "sequelize";

const Configuration = require("config");
const sequelize = new Sequelize(
  Configuration.get("database.Name"),
  Configuration.get("database.Username"),
  Configuration.get("database.Password"),
  {
    host: Configuration.get("database.Host"),
    dialect: Configuration.get("database.dialect"),
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
