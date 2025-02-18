const { BusinessType } = require("../models");

class BusinessTypeService {
  async getAll() {
    return await BusinessType.findAll();
  }

  async getById(id) {
    return await BusinessType.findByPk(id);
  }

  async create(data) {
    return await BusinessType.create(data);
  }

  async update(id, data) {
    const businessType = await BusinessType.findByPk(id);
    if (!businessType) throw new Error("Тип бизнеса не найден");
    return await businessType.update(data);
  }

  async delete(id) {
    const businessType = await BusinessType.findByPk(id);
    if (!businessType) throw new Error("Тип бизнеса не найден");
    await businessType.destroy();
    return { message: "Тип бизнеса удален" };
  }
}

module.exports = new BusinessTypeService();
