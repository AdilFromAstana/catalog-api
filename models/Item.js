const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Item = sequelize.define(
  "Item",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    attributes: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    indexes: [
      {
        using: "GIN",
        fields: ["attributes"],
      },
    ],
  }
);
module.exports = Item;
