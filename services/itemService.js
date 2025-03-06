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
  async getAttributeCounts({ categoryId, businessId }) {
    if (!categoryId || !businessId) {
      throw new Error("categoryId и businessId обязательны");
    }

    return await sequelize.query(
      `SELECT 
            "code",
            "titleRu",
            "titleKz",
            json_agg(json_build_object('value', TRIM(BOTH '\"' FROM "value"::text), 'count', count)) AS options
        FROM (
            SELECT 
                "code",
                "titleRu",
                "titleKz",
                TRIM(BOTH '\"' FROM "value"::text) AS value, 
                COUNT(*) AS count 
            FROM "ItemAttributes" 
            WHERE "categoryId" = :categoryId AND "businessId" = :businessId
            GROUP BY "code", "titleRu", "titleKz", "value"
            ORDER BY count DESC
        ) subquery
        GROUP BY "code", "titleRu", "titleKz";`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { categoryId, businessId },
      }
    );
  }

  /// ПОИСК ПО ФИЛЬТРАМ
  async filterItems({ categoryId, businessId, filters }) {
    console.log("🔍 Входные параметры (до парсинга):", {
      categoryId,
      businessId,
      filters,
    });

    if (!categoryId || !businessId) {
      throw new Error("categoryId и businessId обязательны");
    }

    // ✅ Если filters строка, парсим её
    if (typeof filters === "string") {
      try {
        filters = JSON.parse(filters);
      } catch (error) {
        console.error("❌ Ошибка парсинга filters:", error);
        throw new Error("Некорректный формат filters");
      }
    }

    console.log("🔍 Входные параметры (после парсинга):", filters);

    // Если filters пуст, сразу возвращаем все товары без фильтрации
    if (!filters || Object.keys(filters).length === 0) {
      console.log("⚠️ Фильтры не переданы, возвращаем все товары.");
      return await sequelize.query(
        `SELECT DISTINCT i.* FROM "Items" i 
             WHERE i."categoryId" = :categoryId 
             AND i."businessId" = :businessId`,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { categoryId, businessId },
        }
      );
    }

    let whereConditions = [];
    let joinClauses = [];
    let aliasIndex = 1;

    for (const [key, rawValues] of Object.entries(filters)) {
      console.log(`🛠 Обработка фильтра: ${key} =>`, rawValues);

      // Если rawValues пуст, пропускаем этот фильтр
      if (!Array.isArray(rawValues) || rawValues.length === 0) {
        console.log(`⚠️ Фильтр ${key} пуст, пропускаем.`);
        continue;
      }

      const alias = `ia${aliasIndex}`;
      joinClauses.push(
        `JOIN "ItemAttributes" ${alias} ON i.id = ${alias}."itemId"`
      );

      // Применяем TRIM() для удаления кавычек и корректного сравнения
      const conditions = rawValues
        .map((val) => `TRIM(BOTH '"' FROM ${alias}."value"::text) = '${val}'`)
        .join(" OR ");

      whereConditions.push(`(${alias}."code" = '${key}' AND (${conditions}))`);

      aliasIndex++;
    }

    // Если после фильтрации нет условий, возвращаем все товары
    if (whereConditions.length === 0) {
      console.log("⚠️ После фильтрации нет условий, возвращаем все товары.");
      return await sequelize.query(
        `SELECT DISTINCT i.* FROM "Items" i 
             WHERE i."categoryId" = :categoryId 
             AND i."businessId" = :businessId`,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { categoryId, businessId },
        }
      );
    }

    // Финальный SQL-запрос
    const query = `
        SELECT DISTINCT i.* 
        FROM "Items" i 
        ${joinClauses.join(" ")} 
        WHERE i."categoryId" = :categoryId 
        AND i."businessId" = :businessId 
        AND ${whereConditions.join(" AND ")}`;

    console.log("✅ Итоговый SQL-запрос:", query);

    const result = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { categoryId, businessId },
    });

    console.log("📌 Найденные товары:", result);

    return result;
  }
  /// ПОИСК ПО КАТЕГОРИИ
  async getItemsByCategory({ categoryId = null, businessId }) {
    if (!businessId) {
      throw new Error("businessId обязателен");
    }

    let query;
    let replacements = { businessId };

    if (categoryId) {
      // Если передан categoryId, ищем товары в этой категории и её подкатегориях
      query = `
        WITH RECURSIVE category_tree AS (
          SELECT id FROM "Categories" WHERE id = :categoryId
          UNION ALL
          SELECT c.id FROM "Categories" c
          JOIN category_tree ct ON c."parentId" = ct.id
        )
        SELECT * FROM "Items"
        WHERE "categoryId" IN (SELECT id FROM category_tree)
        AND "businessId" = :businessId;
      `;
      replacements.categoryId = categoryId;
    } else {
      // Если categoryId не передан, выбираем все товары по businessId
      query = `
        SELECT * FROM "Items"
        WHERE "businessId" = :businessId;
      `;
    }

    return await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements,
    });
  }

  async getFilteredItems({ categoryId = null, businessId, filters = {} }) {
    console.log("🔍 Входные параметры:", { categoryId, businessId, filters });

    if (!businessId) {
      throw new Error("businessId обязателен");
    }

    // ✅ Если filters строка, парсим её
    if (typeof filters === "string") {
      try {
        filters = JSON.parse(filters);
      } catch (error) {
        console.error("❌ Ошибка парсинга filters:", error);
        throw new Error("Некорректный формат filters");
      }
    }

    let query;
    let replacements = { businessId };

    // 1️⃣ Если передан categoryId, получаем данные категории
    if (categoryId) {
      console.log("🔎 Проверяем, есть ли у категории подкатегории...");
      const category = await sequelize.query(
        `SELECT "hasChild" FROM "Categories" WHERE id = :categoryId`,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { categoryId },
        }
      );

      // Если категория не найдена
      if (!category.length) {
        throw new Error(`Категория с id ${categoryId} не найдена`);
      }

      const hasChild = category[0].hasChild;
      console.log(`📌 hasChild = ${hasChild}`);

      // 2️⃣ Если у категории есть подкатегории, ищем товары во всех подкатегориях
      if (hasChild) {
        console.log("🔎 Ищем товары в категории и её подкатегориях.");
        query = `
                WITH RECURSIVE category_tree AS (
                    SELECT id FROM "Categories" WHERE id = :categoryId
                    UNION ALL
                    SELECT c.id FROM "Categories" c
                    JOIN category_tree ct ON c."parentId" = ct.id
                )
                SELECT * FROM "Items"
                WHERE "categoryId" IN (SELECT id FROM category_tree)
                AND "businessId" = :businessId;
            `;
        replacements.categoryId = categoryId;

        // 3️⃣ Если у категории нет подкатегорий, применяем фильтры
      } else {
        console.log("🔎 Ищем товары по категории с фильтрами.");

        let whereConditions = [
          `i."categoryId" = :categoryId`,
          `i."businessId" = :businessId`,
        ];
        let joinClauses = [];
        let aliasIndex = 1;

        for (const [key, rawValues] of Object.entries(filters)) {
          console.log(`🛠 Обработка фильтра: ${key} =>`, rawValues);

          // Если rawValues пуст, пропускаем этот фильтр
          if (!Array.isArray(rawValues) || rawValues.length === 0) {
            console.log(`⚠️ Фильтр ${key} пуст, пропускаем.`);
            continue;
          }

          const alias = `ia${aliasIndex}`;
          joinClauses.push(
            `JOIN "ItemAttributes" ${alias} ON i.id = ${alias}."itemId"`
          );

          // Применяем TRIM() для удаления кавычек и корректного сравнения
          const conditions = rawValues
            .map(
              (val) => `TRIM(BOTH '"' FROM ${alias}."value"::text) = '${val}'`
            )
            .join(" OR ");

          whereConditions.push(
            `(${alias}."code" = '${key}' AND (${conditions}))`
          );
          aliasIndex++;
        }

        // Если после фильтрации нет условий, возвращаем все товары
        if (whereConditions.length === 0) {
          console.log(
            "⚠️ После фильтрации нет условий, возвращаем все товары."
          );
          query = `
                    SELECT DISTINCT i.* FROM "Items" i 
                    WHERE i."categoryId" = :categoryId 
                    AND i."businessId" = :businessId`;
        } else {
          query = `
                    SELECT DISTINCT i.* 
                    FROM "Items" i 
                    ${joinClauses.join(" ")} 
                    WHERE ${whereConditions.join(" AND ")}`;
        }

        replacements.categoryId = categoryId;
      }

      // 4️⃣ Если categoryId не передан, выбираем все товары по businessId
    } else {
      console.log("🔎 Ищем все товары по бизнесу.");
      query = `
            SELECT * FROM "Items"
            WHERE "businessId" = :businessId;
        `;
    }

    console.log("✅ Итоговый SQL-запрос:", query);

    const result = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements,
    });

    console.log("📌 Найденные товары:", result);

    return result;
  }
}
module.exports = new ItemService();
