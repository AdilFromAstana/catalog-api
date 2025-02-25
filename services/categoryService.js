const { Category } = require("../models");

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

  async getCategoriesByLevelAndParent(level, parentId = null) {
    try {
      let whereCondition = {};
      if (parentId && level > 1) {
        whereCondition.parentId = parentId;
      }
      if (level <= 3) {
        whereCondition.level = level;
      }
      const categories = await Category.findAll({
        where: whereCondition,
      });

      return {
        categories,
        currentTitleRu: categories[0]?.parentTitleRu || "Главная категория",
        currentId: level === 1 ? null : categories[0]?.parentId, // Если level = 1, parentId = null
        currentLevel: level,
        hasChild: categories[0]?.hasChild
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  }
}

module.exports = new CategoryService();
