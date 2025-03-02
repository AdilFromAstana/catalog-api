const { Item, sequelize, Category } = require("../models");
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

  async getAttributeCounts(categoryId = 294, businessId = 1) {
    if (!categoryId || !businessId) {
      throw new Error("categoryId и businessId обязательны");
    }

    return await sequelize.query(
      `SELECT 
            code,
            json_agg(json_build_object('value', value::text, 'count', count)) AS options
        FROM (
            SELECT 
                code,
                value::text AS value, 
                COUNT(*) AS count 
            FROM "ItemAttributes" 
            WHERE "categoryId" = :categoryId AND "businessId" = :businessId
            GROUP BY code, value
            ORDER BY count DESC
        ) subquery
        GROUP BY code;`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { categoryId, businessId },
      }
    );
  }

  // Фильтрация товаров по атрибутам
  async filterItems(filters) {
    if (!filters || Object.keys(filters).length === 0) {
      throw new Error("Не переданы фильтры");
    }

    let whereConditions = [];
    let joinClauses = [];
    let i = 1;

    for (const [key, value] of Object.entries(filters)) {
      const alias = `ia${i}`;
      joinClauses.push(
        `JOIN "ItemAttributes" ${alias} ON i.id = ${alias}."itemId"`
      );

      if (Array.isArray(value)) {
        whereConditions.push(
          `'${value[0]}' = ANY(SELECT jsonb_array_elements_text(${alias}.value)) AND ${alias}.code = '${key}'`
        );
      } else {
        whereConditions.push(
          `${alias}.code = '${key}' AND ${alias}.value = '"${value}"'`
        );
      }
      i++;
    }

    const query = `SELECT i.* FROM "Items" i ${joinClauses.join(
      " "
    )} WHERE ${whereConditions.join(" AND ")}`;

    return await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
  }
}
module.exports = new ItemService();
