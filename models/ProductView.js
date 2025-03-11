const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ProductView = sequelize.define("ProductView", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  viewedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  duration: { type: DataTypes.INTEGER, allowNull: true },
  ipAddress: { type: DataTypes.STRING, allowNull: false }, // Добавили IP
  source: { type: DataTypes.STRING, allowNull: false },
});

module.exports = ProductView;
