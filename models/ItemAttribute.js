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
        model: "Items", // Ссылаемся на таблицу `items`
        key: "id",
      },
      onDelete: "CASCADE",
    },
    code: { type: DataTypes.STRING, allowNull: false }, // Код атрибута
    titleKz: { type: DataTypes.STRING, allowNull: false }, // Название на казахском
    titleRu: { type: DataTypes.STRING, allowNull: false }, // Название на русском
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
