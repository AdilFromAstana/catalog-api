const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Type = sequelize.define("Type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  categoryId: {
    type: DataTypes.INTEGER,
    references: { model: "Categories", key: "id" },
  },
});

module.exports = Type;
