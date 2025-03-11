const attributeService = require("../services/attributeService");

class AttributeController {
  async getAll(req, res) {
    try {
      const attributees = await attributeService.getAll();
      res.json(attributees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const attribute = await attributeService.getById(req.params.id);
      if (!attribute)
        return res.status(404).json({ error: "Бизнес не найден" });
      res.json(attribute);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const attribute = await attributeService.create(req.body);
      res.status(201).json(attribute);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const attribute = await attributeService.update(req.params.id, req.body);
      res.json(attribute);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const message = await attributeService.delete(req.params.id);
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AttributeController();
