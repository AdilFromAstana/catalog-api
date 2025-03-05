const categoryService = require("../services/categoryService");

class CategoryController {
  /**
   * @swagger
   * /api/categories/:
   *   get:
   *     summary: Получить все категории
   *     description: Возвращает список всех категорий
   *     responses:
   *       200:
   *         description: Список категорий успешно получен
   */
  async getAll(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Категория не найдена" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const category = await categoryService.updateCategory(
        req.params.id,
        req.body
      );
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const message = await categoryService.deleteCategory(req.params.id);
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCategoriesByLevelAndParent(req, res) {
    try {
      const categories = await categoryService.getCategoriesByLevelAndParent({
        level: req.query.level,
        parentId: req.query.parentId,
        titleRu: req.query.titleRu,
      });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCategoriesAndAttributesByLevelAndParent(req, res) {
    try {
      const categories =
        await categoryService.getCategoriesAndAttributesByLevelAndParent({
          level: req.query.level,
          parentId: req.query.parentId,
          titleRu: req.query.titleRu,
        });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addOrUpdateAttributes(req, res) {
    try {
      const { id } = req.params;
      const { attributes } = req.body;

      if (!Array.isArray(attributes)) {
        return res
          .status(400)
          .json({ error: "attributes должен быть массивом" });
      }

      const updatedCategory = await categoryService.addOrUpdateAttributes(
        id,
        attributes
      );

      if (!updatedCategory) {
        return res.status(404).json({ error: "Категория не найдена" });
      }

      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/categories/getCategoryHierarchiesByIds:
   *   get:
   *     summary: Получить иерархию категорий по массиву ID
   *     description: Возвращает иерархию категорий для переданных ID
   *     parameters:
   *       - in: query
   *         name: categoryIds
   *         required: true
   *         schema:
   *           type: string
   *         description: Список ID категорий, передаваемых через запятую (например, "123,456,789")
   *     responses:
   *       200:
   *         description: Иерархия категорий успешно получена
   *       400:
   *         description: Некорректный запрос (отсутствует параметр categoryIds)
   *       500:
   *         description: Внутренняя ошибка сервера
   */
  async getCategoryHierarchiesByIds(req, res) {
    try {
      const { categoryIds } = req.query;

      if (!categoryIds) {
        return res
          .status(400)
          .json({ error: "categoryIds является обязательным параметром" });
      }

      // Преобразуем строку "123,456,789" в массив ["123", "456", "789"]
      const categoryIdsArray = categoryIds.split(",");

      const items = await categoryService.getCategoryHierarchiesByIds(
        categoryIdsArray
      );
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/categories/getCategoryHierarchiesByBusiness:
   *   get:
   *     summary: Получить иерархию категорий по бизнесу
   *     description: Возвращает структуру категорий для указанного бизнеса
   *     parameters:
   *       - in: query
   *         name: businessId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID бизнеса
   *     responses:
   *       200:
   *         description: Иерархия категорий успешно получена
   *       400:
   *         description: Отсутствует параметр businessId
   *       500:
   *         description: Внутренняя ошибка сервера
   */
  async getCategoryHierarchiesByBusiness(req, res) {
    try {
      const businessId = req.query.businessId;
      console.log("businessId: ", businessId);
      const items = await categoryService.getCategoryHierarchiesByBusiness(
        businessId
      );
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CategoryController();
