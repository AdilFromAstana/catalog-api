const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Attribute = sequelize.define("Attribute", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  code: {
    // Уникальный код характеристики (например, "size", "color")
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    // Человекочитаемое название характеристики
    type: DataTypes.STRING,
    allowNull: false,
  },
  options: {
    // JSONB массив с кодами и значениями возможных вариантов
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
});
module.exports = Attribute;
