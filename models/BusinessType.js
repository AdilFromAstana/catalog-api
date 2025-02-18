const { DataTypes } = require("sequelize");
const sequelize = require('../db');

const BusinessType = sequelize.define("BusinessType", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

module.exports = BusinessType;
