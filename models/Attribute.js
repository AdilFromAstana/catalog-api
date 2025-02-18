const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Attribute = sequelize.define("Attribute", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: {
        type: DataTypes.ENUM("select", "multiselect", "number", "string"),
        allowNull: false
    },
    options: { type: DataTypes.JSONB, defaultValue: [] } // Только для select/multiselect
});

module.exports = Attribute;
