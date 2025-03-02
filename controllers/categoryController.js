const categoryService = require("../services/categoryService");

class CategoryController {
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
}

module.exports = new CategoryController();
