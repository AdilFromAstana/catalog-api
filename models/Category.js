const { DataTypes } = require("sequelize");
const sequelize = require('../db');

const Category = sequelize.define("Category", {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    level: { type: DataTypes.INTEGER, allowNull: false }, // Уровень категории (1, 2, 3)
    titleKz: { type: DataTypes.STRING, allowNull: false }, // Название категории
    titleRu: { type: DataTypes.STRING, allowNull: false }, // Название категории
    parentId: { type: DataTypes.INTEGER, allowNull: true, references: { model: "Categories", key: "id" } }, // Родительская категория
    parentTitleRu: { type: DataTypes.STRING, allowNull: false },
    parentTitleKz: { type: DataTypes.STRING, allowNull: false },
    mainCategoryId: { type: DataTypes.INTEGER, allowNull: true, references: { model: "Categories", key: "id" } }, // Главная категория
    mainCategoryTitleRu: { type: DataTypes.STRING, allowNull: false },
    mainCategoryTitleKz: { type: DataTypes.STRING, allowNull: false },
    hasChild: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false } // Есть ли подкатегории
});

module.exports = Category;
