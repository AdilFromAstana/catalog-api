const { Attribute } = require("../models");

class AttributeService {
  async getAll() {
    return await Attribute.findAll();
  }

  async getById(id) {
    return await Attribute.findByPk(id);
  }

  async create(data) {
    return await Attribute.create(data);
  }

  async update(id, data) {
    const attribute = await Attribute.findByPk(id);
    if (!attribute) throw new Error("Бизнес не найден");
    return await attribute.update(data);
  }

  async delete(id) {
    const attribute = await Attribute.findByPk(id);
    if (!attribute) throw new Error("Бизнес не найден");
    await attribute.destroy();
    return { message: "Бизнес удален" };
  }
}

module.exports = new AttributeService();
