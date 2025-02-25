const sequelize = require("../db");
const BusinessType = require("./BusinessType");
const Business = require("./Business");
const Category = require("./Category");
const Item = require("./Item");
const Type = require("./Type");
const Attribute = require("./Attribute");

Business.belongsTo(BusinessType, { foreignKey: "typeId" });
BusinessType.hasMany(Business, { foreignKey: "typeId" });

Category.belongsTo(Category, { as: "parent", foreignKey: "parentId" });
Category.hasMany(Category, { as: "children", foreignKey: "parentId" });

Category.hasMany(Attribute, { foreignKey: "categoryId", as: "attributes" });
Attribute.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

Item.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Item, { foreignKey: "categoryId" });

Item.belongsTo(Type, { foreignKey: "typeId" });
Type.hasMany(Item, { foreignKey: "typeId" });

Item.belongsTo(Business, { foreignKey: "businessId" });
Business.hasMany(Item, { foreignKey: "businessId" });

Type.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Type, { foreignKey: "categoryId" });

module.exports = {
  BusinessType,
  Business,
  Category,
  Item,
  Type,
  sequelize,
};
