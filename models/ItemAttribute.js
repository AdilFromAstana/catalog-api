const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ItemAttribute = sequelize.define(
  "ItemAttribute",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Items",
        key: "id",
      },
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Businesses",
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Categories",
        key: "id",
      },
    },
    code: { type: DataTypes.STRING, allowNull: false },
    titleKz: { type: DataTypes.STRING, allowNull: false },
    titleRu: { type: DataTypes.STRING, allowNull: false },
    dataType: {
      type: DataTypes.ENUM(
        "string",
        "number",
        "boolean",
        "variant",
        "variantArray"
      ),
      allowNull: false,
    },
    value: {
      type: DataTypes.JSONB, // Значение атрибута, если это массив, строка или число
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        using: "BTREE", // Индекс по `itemId` для быстрого поиска
        fields: ["itemId"],
      },
      {
        using: "BTREE",
        fields: ["code"], // Индекс по коду атрибута
      },
      {
        using: "GIN",
        fields: ["value"], // GIN индекс для быстрого поиска в JSONB
      },
    ],
  }
);

module.exports = ItemAttribute;
