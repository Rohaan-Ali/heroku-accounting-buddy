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

class Transaction extends Model {}

Transaction.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    Receipt: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    ItemType: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    IsApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: "Transaction",
    tableName: "Transactions",
    timestamps: false,
  }
);

module.exports = Transaction;
