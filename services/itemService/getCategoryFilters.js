const { Category, sequelize } = require("../../models");

module.exports = async function getCategoryFilters({
  categoryId = null,
  businessId,
}) {
  if (!businessId) {
    throw new Error("businessId обязателен");
  }

  // Получаем общее количество товаров
  const [{ count: totalItems }] = await sequelize.query(
    `SELECT COUNT(*)::int AS count FROM "Items" WHERE "businessId" = :businessId`,
    {
      type: sequelize.QueryTypes.SELECT,
      replacements: { businessId },
    }
  );

  // Если категория не указана — просто вернем список категорий с товарами
  if (!categoryId) {
    const categories = await sequelize.query(
      `
            SELECT DISTINCT c.id, c."titleRu", c."titleKz", c."hasChild"
            FROM "Categories" c
            JOIN "Items" i ON i."categoryId" = c.id
            WHERE i."businessId" = :businessId
            ORDER BY c."titleRu" ASC
            `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { businessId },
      }
    );

    return {
      mode: "categories",
      categories,
      totalItems,
    };
  }

  // Если категория указана
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new Error(`Категория с id = ${categoryId} не найдена`);
  }

  // Если у категории есть подкатегории — вернем их
  if (category.hasChild) {
    const childCategories = await Category.findAll({
      where: { parentId: categoryId },
      attributes: ["id", "titleRu", "titleKz", "hasChild"],
      order: [["titleRu", "ASC"]],
    });

    return {
      mode: "categories",
      categories: childCategories,
      totalItems,
    };
  }

  // Если конечная категория — фильтры
  const categoryTreeQuery = `
          WITH RECURSIVE category_tree AS (
            SELECT id FROM "Categories" WHERE id = :categoryId
            UNION ALL
            SELECT c.id FROM "Categories" c
            JOIN category_tree ct ON c."parentId" = ct.id
          )
          SELECT id FROM category_tree
        `;

  const categoryIds = (
    await sequelize.query(categoryTreeQuery, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { categoryId },
    })
  ).map((row) => row.id);

  // Диапазон цен
  const [priceRange] = await sequelize.query(
    `
          SELECT MIN(price) AS "minPrice", MAX(price) AS "maxPrice"
          FROM "Items"
          WHERE "businessId" = :businessId AND "categoryId" IN (:categoryIds)
          `,
    {
      type: sequelize.QueryTypes.SELECT,
      replacements: { businessId, categoryIds },
    }
  );

  // Атрибуты
  const attributes = await sequelize.query(
    `
          SELECT ia."code", ia."titleRu", TRIM(BOTH '"' FROM ia."value"::text) AS "value", COUNT(*) AS "count"
          FROM "ItemAttributes" ia
          JOIN "Items" i ON ia."itemId" = i.id
          WHERE i."businessId" = :businessId AND i."categoryId" IN (:categoryIds)
          GROUP BY ia."code", ia."titleRu", ia."value"
          `,
    {
      type: sequelize.QueryTypes.SELECT,
      replacements: { businessId, categoryIds },
    }
  );

  // Группируем по коду атрибута
  const groupedAttributes = attributes.reduce((acc, attr) => {
    if (!acc[attr.code]) {
      acc[attr.code] = {
        titleRu: attr.titleRu,
        values: [],
      };
    }
    acc[attr.code].values.push({
      value: attr.value,
      count: Number(attr.count),
    });
    return acc;
  }, {});

  return {
    mode: "filters",
    minPrice: priceRange.minPrice || 0,
    maxPrice: priceRange.maxPrice || 0,
    attributes: groupedAttributes,
    totalItems,
  };
};
