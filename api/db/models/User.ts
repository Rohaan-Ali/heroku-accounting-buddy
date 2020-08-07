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

const dbWrapper = require("../DbWrapper");

class User extends Model {}

User.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RoleCD: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    GarageId: {
      type: DataTypes.INTEGER,
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
    modelName: "User",
    tableName: "Users",
    timestamps: false,
  }
);

module.exports = User;
