const itemService = require("../services/itemService");

class ItemController {
  async getAll(req, res) {
    try {
      const items = await itemService.getAll();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOne(req, res) {
    try {
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
