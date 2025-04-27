const itemService = require("../services/itemService");

class ItemController {
  async getAll(req, res) {
    try {
      const businessId = req.query.businessId;
      const categoryId = req.query.categoryId;
      const items = await itemService.getAll({ businessId, categoryId });
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async filterItems(req, res) {
    try {
      const businessId = req.query.businessId;
      const categoryId = req.query.categoryId;
      const filters = req.query.filters;
      const items = await itemService.filterItems({
        businessId,
        categoryId,
        filters,
      });
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  /**
   * @swagger
   * /api/items/getItemsByCategory:
   *   get:
   *     summary: Получить товары по категории и бизнесу
   *     description: Возвращает список товаров, относящихся к указанной категории и бизнесу. Если `categoryId` не указан, возвращает все товары бизнеса.
   *     parameters:
   *       - in: query
   *         name: categoryId
   *         required: false
   *         schema:
   *           type: string
   *         description: ID категории, для которой нужно получить товары. Если не указано, возвращаются все товары бизнеса.
   *       - in: query
   *         name: businessId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID бизнеса, для которого нужно получить товары (обязательный параметр).
   *     responses:
   *       200:
   *         description: Список товаров успешно получен
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     example: 1
   *                   name:
   *                     type: string
   *                     example: "Футболка мужская"
   *                   price:
   *                     type: number
   *                     example: 1999.99
   *                   categoryId:
   *                     type: integer
   *                     example: 123
   *                   businessId:
   *                     type: integer
   *                     example: 10
   *       400:
   *         description: Некорректный запрос (отсутствует businessId)
   *       500:
   *         description: Внутренняя ошибка сервера
   */
  async getItemsByCategory(req, res) {
    const categoryId = req?.query?.categoryId;
    const businessId = req?.query?.businessId;
    try {
      if (!businessId) {
        return res
          .status(400)
          .json({ error: "businessId является обязательным параметром" });
      }

      const items = await itemService.getItemsByCategory({
        categoryId,
        businessId,
      });
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCategoryFilters(req, res) {
    const categoryId = req?.query?.categoryId;
    const businessId = req?.query?.businessId;
    try {
      if (!businessId) {
        return res
          .status(400)
          .json({ error: "businessId является обязательным параметром" });
      }

      const items = await itemService.getCategoryFilters({
        categoryId,
        businessId,
      });
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAttributeCounts(req, res) {
    const categoryId = req.query.categoryId;
    const businessId = req.query.businessId;
    try {
      const items = await itemService.getAttributeCounts({
        categoryId,
        businessId,
      });
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFilteredItems(req, res) {
    const categoryId = req.query.categoryId;
    const businessId = req.query.businessId;
    const filters = req.query.filters;
    try {
      const items = await itemService.getAttributeCounts({
        categoryId,
        businessId,
        filters,
      });
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      console.log("req.params.id: ", req.params.id);
      const item = await itemService.getById(req.params.id);
      if (!item) return res.status(404).json({ error: "Товар не найден" });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const item = await itemService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const item = await itemService.update(req.params.id, req.body);
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const message = await itemService.delete(req.params.id);
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ItemController();
