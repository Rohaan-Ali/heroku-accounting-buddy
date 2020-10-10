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
