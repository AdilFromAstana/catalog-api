const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Business = require("./Business"); // Импортируем модель Business
const Category = require("./Category");

const Item = sequelize.define("Item", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: "id",
    },
  },
  businessId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Business,
      key: "id",
    },
  },
});

module.exports = Item;
