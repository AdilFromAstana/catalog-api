const sequelize = require("../db");
const BusinessType = require("./BusinessType");
const Business = require("./Business");
const Category = require("./Category");
const Item = require("./Item");
const Type = require("./Type");
const Attribute = require("./Attribute");
const CategoryAttribute = require("./CategoryAttribute");
const AttributeOption = require("./AttributeOption");

Business.belongsTo(BusinessType, { foreignKey: "typeId" });
BusinessType.hasMany(Business, { foreignKey: "typeId" });

Category.belongsTo(Category, { as: "parent", foreignKey: "parentId" });
Category.hasMany(Category, { as: "children", foreignKey: "parentId" });

Item.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Item, { foreignKey: "categoryId" });

Item.belongsTo(Type, { foreignKey: "typeId" });
Type.hasMany(Item, { foreignKey: "typeId" });

Item.belongsTo(Business, { foreignKey: "businessId" });
Business.hasMany(Item, { foreignKey: "businessId" });

Type.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Type, { foreignKey: "categoryId" });

Category.belongsToMany(Attribute, { through: CategoryAttribute });
Attribute.belongsToMany(Category, { through: CategoryAttribute });

Attribute.hasMany(AttributeOption, { foreignKey: "attributeId" });
AttributeOption.belongsTo(Attribute, { foreignKey: "attributeId" });

module.exports = {
  BusinessType,
  Business,
  Category,
  Item,
  Type,
  sequelize,
};
