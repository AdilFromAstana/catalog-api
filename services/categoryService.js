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
      if (parentId) {
        console.log(typeof parentId)
        whereCondition.parentId = parentId;
      }
      if (level) {
        whereCondition.level = level;
      }
      const categories = await Category.findAll({
        where: whereCondition,
      });

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  }
}

module.exports = new CategoryService();
