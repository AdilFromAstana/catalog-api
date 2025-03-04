const { Item, sequelize, Business } = require("../models");
const ItemAttribute = require("../models/ItemAttribute");

class ItemService {
  async getAll({ businessId, categoryId }) {
    const where = {
      ...(businessId && { businessId }),
      ...(categoryId && { categoryId }),
    };

    return await Item.findAll({
      where,
      include: [
        {
          model: ItemAttribute,
          as: "itemAttributes",
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
      const item = await Item.create(data, { transaction });

      const business = await Business.findByPk(data.businessId, {
        transaction,
      });

      if (business) {
        let uniqueCategories = business.uniqueCategories || [];

        // Если categoryId еще нет в массиве, добавляем
        if (!uniqueCategories.includes(data.categoryId)) {
          uniqueCategories.push(data.categoryId);

          await business.update({ uniqueCategories }, { transaction });
        }
      }

      const attributeData = data.attributes.map((attr) => ({
        itemId: item.id,
        code: attr.code,
        titleKz: attr.titleKz,
        titleRu: attr.titleRu,
        dataType: attr.dataType,
        value: attr.value,
      }));

      await ItemAttribute.bulkCreate(attributeData, { transaction });

      await transaction.commit();

      return item;
    } catch (error) {
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
  /// КОЛ-ВО ВАРИАНТОВ ПАРАМЕТРОВ
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
  /// ПОИСК ПО ФИЛЬТРАМ
  async filterItems(
    categoryId = 294,
    businessId = 1,
    filters = {
      composition: ["Лен"],
      colorType: ["Розовый"],
    }
  ) {
    if (!categoryId || !businessId) {
      throw new Error("categoryId и businessId обязательны");
    }
    if (!filters || Object.keys(filters).length === 0) {
      throw new Error("Не переданы фильтры");
    }

    let whereConditions = [];
    let joinClauses = [];
    let i = 1;

    for (const [key, values] of Object.entries(filters)) {
      const alias = `ia${i}`;
      joinClauses.push(
        `JOIN "ItemAttributes" ${alias} ON i.id = ${alias}."itemId"`
      );

      const valueConditions = values
        .map((value) => `${alias}.value::text = '"${value}"'`)
        .join(" OR ");
      whereConditions.push(
        `(${alias}.code = '${key}' AND (${valueConditions}))`
      );
      i++;
    }

    const query = `
        SELECT DISTINCT i.* FROM "Items" i 
        ${joinClauses.join(" ")} 
        WHERE i."categoryId" = :categoryId AND i."businessId" = :businessId 
        AND ${whereConditions.join(" AND ")}`;

    return await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { categoryId, businessId },
    });
  }
  /// ПОИСК ПО КАТЕГОРИИ
  async getItemsByCategory(categoryId = 300) {
    if (!categoryId) {
      throw new Error("categoryId обязателен");
    }

    return await sequelize.query(
      `WITH RECURSIVE category_tree AS (
            SELECT id FROM "Categories" WHERE id = :categoryId
            UNION ALL
            SELECT c.id FROM "Categories" c
            JOIN category_tree ct ON c."parentId" = ct.id
        )
        SELECT * FROM "Items"
        WHERE "categoryId" IN (SELECT id FROM category_tree);`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { categoryId },
      }
    );
  }
}
module.exports = new ItemService();
