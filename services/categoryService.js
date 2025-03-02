const { Op } = require("sequelize");
const { Category, Attribute } = require("../models");

class CategoryService {
  async getAllCategories() {
    return await Category.findAll();
  }

  async getCategoryById(id) {
    return await Category.findByPk(id);
  }

  async createCategory(data) {
    return await Category.create(data);
  }

  async updateCategory(id, data) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error("Категория не найдена");
    }
    return await category.update(data);
  }

  async deleteCategory(id) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error("Категория не найдена");
    }
    await category.destroy();
    return { message: "Категория удалена" };
  }

  async getCategoriesByLevelAndParent({
    level,
    parentId = null,
    titleRu = "",
  }) {
    try {
      let whereCondition = {};

      // ✅ Если есть `titleRu`, игнорируем `level` и `parentId`
      if (titleRu) {
        whereCondition.titleRu = { [Op.iLike]: `%${titleRu}%` };
      } else {
        // ✅ Если `titleRu` нет, используем `level` и `parentId`
        if (parentId) {
          whereCondition.parentId = parentId;
        }
        if (level) {
          whereCondition.level = level;
        }
      }

      const categories = await Category.findAll({
        where: whereCondition,
      });

      return {
        categories,
        currentTitleRu: categories[0]?.parentTitleRu || "Главная категория",
        currentId: level === 1 ? null : categories[0]?.parentId, // Если level = 1, parentId = null
        currentLevel: level || null,
        hasChild: categories.some((category) => category.hasChild),
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  }

  async addOrUpdateAttributes(categoryId, attributes) {
    const category = await Category.findByPk(categoryId);
    if (!category) return null;

    if (!Array.isArray(attributes)) {
      throw new Error("Attributes должен быть массивом");
    }

    category.set("attributes", attributes);
    await category.save();
    for (const attr of attributes) {
      await Attribute.upsert({
        categoryId,
        code: attr.code,
        titleRu: attr.titleRu,
        titleKz: attr.titleKz,
        options: attr.options || [],
      });
    }

    return { message: "Атрибуты успешно обновлены" };
  }
}

module.exports = new CategoryService();
