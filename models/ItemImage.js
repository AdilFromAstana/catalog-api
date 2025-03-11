const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ItemImage = sequelize.define("ItemImage", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  itemId: { type: DataTypes.INTEGER, allowNull: false },
  imageUrl: { type: DataTypes.STRING, allowNull: false },
  priority: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = ItemImage;
