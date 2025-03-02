const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Business = sequelize.define("Business", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  uniqueCategories: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
  },
  typeId: {
    type: DataTypes.INTEGER,
    references: { model: "BusinessTypes", key: "id" },
  },
});

module.exports = Business;
