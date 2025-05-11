const { Category, sequelize } = require("../../models");

module.exports = async function getItemsByCategory({
  categoryId = null,
  businessId,
  filters = {},
  limit = 10,
}) {
  console.log("🔍 Входные параметры (до парсинга):", {
    categoryId,
    businessId,
    filters,
  });

  if (!businessId) {
    throw new Error("businessId обязателен");
  }

  if (typeof filters === "string") {
    try {
      filters = JSON.parse(filters);
    } catch (error) {
      console.error("❌ Ошибка парсинга filters:", error);
      throw new Error("Некорректный формат filters");
    }
  }

  console.log("🔍 Входные параметры (после парсинга):", filters);

  let whereConditions = [`i."businessId" = :businessId`];
  let joinClauses = [`JOIN "Categories" c ON i."categoryId" = c.id`];
  let replacements = { businessId, limit };
  let categoryTreeQuery = "";

  if (categoryId) {
    // 🔥 Сначала проверяем существует ли категория
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new Error(`Категория с id = ${categoryId} не найдена`);
    }

    categoryTreeQuery = `
            WITH RECURSIVE category_tree AS (
              SELECT id FROM "Categories" WHERE id = :categoryId
              UNION ALL
              SELECT c.id FROM "Categories" c
              JOIN category_tree ct ON c."parentId" = ct.id
            )
          `;
    whereConditions.push(`i."categoryId" IN (SELECT id FROM category_tree)`);
    replacements.categoryId = categoryId;
  }

  let aliasIndex = 1;

  if (filters && Object.keys(filters).length > 0) {
    for (const [key, rawValues] of Object.entries(filters)) {
      console.log(`🛠 Обработка фильтра: ${key} =>`, rawValues);

      if (!Array.isArray(rawValues) || rawValues.length === 0) {
        console.log(`⚠️ Фильтр ${key} пуст, пропускаем.`);
        continue;
      }

      const alias = `ia${aliasIndex}`;
      joinClauses.push(
        `JOIN "ItemAttributes" ${alias} ON i.id = ${alias}."itemId"`
      );

      const conditions = rawValues
        .map((val) => `TRIM(BOTH '"' FROM ${alias}."value"::text) = '${val}'`)
        .join(" OR ");

      whereConditions.push(`(${alias}."code" = '${key}' AND (${conditions}))`);

      aliasIndex++;
    }
  }

  const query = `
          ${categoryTreeQuery}
          SELECT DISTINCT i.*, 
                 c."titleRu" AS "categoryTitleRu", 
                 c."titleKz" AS "categoryTitleKz", 
                 c."parentId",
                 (SELECT "imageUrl" FROM "ItemImages" im WHERE im."itemId" = i.id ORDER BY "priority" ASC LIMIT 1) AS "imageUrl"
          FROM "Items" i 
          ${joinClauses.join(" ")}
          ${
            whereConditions.length > 0
              ? `WHERE ${whereConditions.join(" AND ")}`
              : ""
          }
          LIMIT :limit;
        `;

  const result = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
    replacements,
  });

  return result;
};
