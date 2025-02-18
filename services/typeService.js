const { Type } = require("../models");

class TypeService {
  async getAll() {
    return await Type.findAll();
  }

  async getById(id) {
    return await Type.findByPk(id);
  }

  async create(data) {
    return await Type.create(data);
  }

  async update(id, data) {
    const type = await Type.findByPk(id);
    if (!type) throw new Error("Тип не найден");
    return await type.update(data);
  }

  async delete(id) {
    const type = await Type.findByPk(id);
    if (!type) throw new Error("Тип не найден");
    await type.destroy();
    return { message: "Тип удален" };
  }
}

module.exports = new TypeService();
