const { Item, sequelize } = require("../models");
const ItemAttribute = require("../models/ItemAttribute");

class ItemService {
  async getAll({ businessId }) {
    return await Item.findAll({
      where: { businessId },
      include: [
        {
          model: ItemAttribute,
          as: "itemAttributes", // Указываем псевдоним из модели
        },
      ],
    });
  }

  async getById(id) {
    return await Item.findByPk(id);
  }

  async create(data) {
    const transaction = await sequelize.transaction(); // Создаем транзакцию

    try {
      // Создаем товар (Item) внутри транзакции
      const item = await Item.create(data, { transaction });

      // Преобразуем attributes в массив для записи
      const attributeData = data.attributes.map((attr) => ({
        itemId: item.id,
        code: attr.code,
        titleKz: attr.titleKz,
        titleRu: attr.titleRu,
        dataType: attr.dataType,
        value: attr.value,
      }));

      // Создаем атрибуты (ItemAttribute) внутри транзакции
      await ItemAttribute.bulkCreate(attributeData, { transaction });

      // Подтверждаем транзакцию
      await transaction.commit();

      return item;
    } catch (error) {
      // Откатываем все изменения, если произошла ошибка
      await transaction.rollback();
      throw error; // Пробрасываем ошибку дальше
    }
  }

  async update(id, data) {
    const item = await Item.findByPk(id);
    if (!item) throw new Error("Товар не найден");
    return await item.update(data);
  }

  async delete(id) {
    const item = await Item.findByPk(id);
    if (!item) throw new Error("Товар не найден");
    await item.destroy();
    return { message: "Товар удален" };
  }
}
module.exports = new ItemService();
