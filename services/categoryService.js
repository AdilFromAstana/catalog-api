const { Op } = require("sequelize");
const { Category, Attribute, Business, sequelize } = require("../models");

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

  async getCategoriesAndAttributesByLevelAndParent({
    level,
    parentId = null,
    titleRu = "",
    businessId = 1,
  }) {
    try {
      let whereCondition = {};

      // 1. Получаем бизнес, чтобы взять uniqueCategories
      const business = await Business.findByPk(businessId);

      if (!business) {
        throw new Error(`Business с ID ${businessId} не найден`);
      }

      // 2. Если бизнес ограничен категориями, фильтруем
      if (business.uniqueCategories && business.uniqueCategories.length > 0) {
        whereCondition.id = { [Op.in]: business.uniqueCategories };
      }

      // 3. Фильтр по названию
      if (titleRu) {
        whereCondition.titleRu = { [Op.iLike]: `%${titleRu}%` };
      } else {
        // 4. Если нет `titleRu`, фильтруем по уровню и `parentId`
        if (parentId !== null) {
          whereCondition.parentId = parentId;
        } else if (level) {
          whereCondition.level = level;
        }
      }

      // 5. Получаем категории только одного уровня
      const categories = await Category.findAll({
        where: whereCondition,
      });

      // 6. Если parentId указан, получаем родителя
      let parentCategory = null;
      if (parentId) {
        parentCategory = await Category.findByPk(parentId);
      }

      // 7. Проверяем, есть ли у найденных категорий подкатегории
      const hasChild = categories.some((category) => category.hasChild);

      return {
        categories, // Отдаем только нужный уровень
        parentCategory, // Если был parentId, возвращаем родителя
        currentTitleRu: parentCategory
          ? parentCategory.titleRu
          : "Главная категория",
        currentId: parentCategory ? parentCategory.id : null,
        currentLevel:
          level || (parentCategory ? parentCategory.level + 1 : null),
        hasChild,
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
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

      const hasChild = categories.some((category) => category.hasChild);

      return {
        categories,
        currentTitleRu: categories[0]?.parentTitleRu || "Главная категория",
        currentId: level === 1 ? null : categories[0]?.parentId, // Если level = 1, parentId = null
        currentLevel: level || null,
        hasChild,
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
  ///КАТЕГОРИИ В ДЕРЕВЕ
  async getCategoryHierarchiesByIds(categoryIds = [294, 1148, 990, 1023, 29]) {
    let categories = await Category.findAll({
      where: {
        id: categoryIds,
      },
      attributes: ["id", "titleRu", "parentId", "hasChild"],
    });

    let parentIds = categories
      .map((cat) => cat.parentId)
      .filter((id) => id !== null);

    while (parentIds.length > 0) {
      let parents = await Category.findAll({
        where: {
          id: parentIds,
        },
        attributes: ["id", "titleRu", "parentId", "hasChild"],
      });

      categories.push(...parents);
      parentIds = parents
        .map((cat) => cat.parentId)
        .filter((id) => id !== null);
    }

    let categoryMap = new Map();
    categories.forEach((category) => {
      categoryMap.set(category.id, { ...category.dataValues, children: [] });
    });

    let tree = [];
    categoryMap.forEach((category) => {
      if (category.parentId && categoryMap.has(category.parentId)) {
        categoryMap.get(category.parentId).children.push(category);
      } else {
        tree.push(category);
      }
    });

    return tree;
  }

  async getCategoryHierarchiesByBusiness(businessId = 1) {
    if (!businessId) {
      throw new Error("businessId обязателен");
    }

    let categoryIds = await sequelize.query(
      `SELECT DISTINCT "categoryId" FROM "Items" WHERE "businessId" = :businessId`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { businessId },
      }
    );

    categoryIds = categoryIds.map((row) => row.categoryId);

    if (categoryIds.length === 0) {
      return []; // Если у бизнеса нет товаров, возвращаем пустой массив
    }

    // 2️⃣ Получаем все категории, включая родительские
    let categories = await Category.findAll({
      where: { id: categoryIds },
      attributes: ["id", "titleRu", "parentId", "hasChild"],
    });

    let parentIds = categories
      .map((cat) => cat.parentId)
      .filter((id) => id !== null);

    while (parentIds.length > 0) {
      let parents = await Category.findAll({
        where: { id: parentIds },
        attributes: ["id", "titleRu", "parentId", "hasChild"],
      });

      categories.push(...parents);
      parentIds = parents
        .map((cat) => cat.parentId)
        .filter((id) => id !== null);
    }

    // 3️⃣ Строим дерево категорий
    let categoryMap = new Map();
    categories.forEach((category) => {
      categoryMap.set(category.id, { ...category.dataValues, children: [] });
    });

    let tree = [];
    categoryMap.forEach((category) => {
      if (category.parentId && categoryMap.has(category.parentId)) {
        categoryMap.get(category.parentId).children.push(category);
      } else {
        tree.push(category);
      }
    });

    return tree;
  }
}

module.exports = new CategoryService();
