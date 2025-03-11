const sequelize = require("../db");
const BusinessType = require("./BusinessType");
const Business = require("./Business");
const Category = require("./Category");
const Item = require("./Item");
const Type = require("./Type");
const Attribute = require("./Attribute");
const ItemAttribute = require("./ItemAttribute");
const ProductView = require("./ProductView");
const ItemImage = require("./ItemImage");

// Связь между Business и BusinessType
Business.belongsTo(BusinessType, { foreignKey: "typeId" });
BusinessType.hasMany(Business, { foreignKey: "typeId" });

// Категории могут быть иерархическими
Category.belongsTo(Category, { as: "parent", foreignKey: "parentId" });
Category.hasMany(Category, { as: "children", foreignKey: "parentId" });

// Товары принадлежат категориям
Item.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Item, { foreignKey: "categoryId" });

// Товары принадлежат определенному типу
Item.belongsTo(Type, { foreignKey: "typeId" });
Type.hasMany(Item, { foreignKey: "typeId" });

// Товары принадлежат бизнесу
Item.belongsTo(Business, { foreignKey: "businessId" });
Business.hasMany(Item, { foreignKey: "businessId" });

// Типы принадлежат категории
Type.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Type, { foreignKey: "categoryId" });

// ✅ Добавляем связь между Item и ItemAttribute
Item.hasMany(ItemAttribute, { foreignKey: "itemId", as: "itemAttributes" });
ItemAttribute.belongsTo(Item, { foreignKey: "itemId", as: "item" });

Item.hasMany(ItemImage, { foreignKey: "itemId", as: "images" });
ItemImage.belongsTo(Item, { foreignKey: "itemId", as: "item" });

module.exports = {
  BusinessType,
  Business,
  Category,
  Item,
  Type,
  Attribute,
  ItemAttribute,
  ProductView,
  ItemImage,
  sequelize,
};
