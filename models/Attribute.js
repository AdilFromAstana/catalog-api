const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Attribute = sequelize.define(
  "Attribute",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    titleRu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    titleKz: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    indexes: [
      {
        using: "GIN",
        fields: ["options"],
      },
    ],
  }
);
module.exports = Attribute;
