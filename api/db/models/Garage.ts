import { Sequelize, DataTypes, Model } from "sequelize";

const sequelize = new Sequelize("AccountingBuddy", "postgres", "bcsf13m015", {
  host: "localhost",
  dialect: "postgres",
});

class Garage extends Model {
  // This is used to update db schema if there is any new changes
  static updateSchema() {
    Garage.sync({ force: true });
    console.log("The table for the Garage model was just (re)created!");
  }
}

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
