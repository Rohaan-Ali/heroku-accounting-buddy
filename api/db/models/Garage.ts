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

class Garage extends Model {}

Garage.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    BusinessNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Workers: {
      type: DataTypes.JSON,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    modelName: "Garage",
    tableName: "Garages",
    timestamps: false,
  }
);

module.exports = Garage;
