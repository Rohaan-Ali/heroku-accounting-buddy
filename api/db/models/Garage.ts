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
    indexes: [
      {
        unique: true,
        fields: ["Name", "Address", "BusinessNumber"],
      },
    ],
  }
);

module.exports = Garage;
