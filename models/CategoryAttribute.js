const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const CategoryAttribute = sequelize.define("CategoryAttribute", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    categoryId: { type: DataTypes.INTEGER, references: { model: "Categories", key: "id" } },
    attributeId: { type: DataTypes.INTEGER, references: { model: "Attributes", key: "id" } },
    isRequired: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = CategoryAttribute;
