import { Sequelize, DataTypes, Model } from "sequelize";

const sequelize = new Sequelize("AccountingBuddy", "postgres", "bcsf13m015", {
  host: "localhost",
  dialect: "postgres",
});

class Car extends Model {
  // This is used to update db schema if there is any new changes
  static updateSchema() {
    Car.sync({ force: true });
    console.log("The table for the Car model was just (re)created!");
  }
}

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
