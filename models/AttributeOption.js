const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const AttributeOption = sequelize.define("AttributeOption", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    attributeId: { type: DataTypes.INTEGER, references: { model: "Attributes", key: "id" } },
    value: { type: DataTypes.STRING, allowNull: false }
});

module.exports = AttributeOption;
