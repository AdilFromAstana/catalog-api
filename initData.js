const Category = require("./models/Category");

const categoriesData = [];

const transformData = (data) =>
  data.map((item) => ({
    id: item.id,
    level: item.level,
    titleRu: item.title,
    titleKz: "-",
    commissionStart: item.commission_start,
    commissionEnd: item.commission_end,
    parentId: item.parent_id,
    parentTitleRu: item.parent_title,
    parentTitleKz: "-",
    mainCategoryId: item.main_category_id,
    mainCategoryTitleRu: item.main_category_title,
    mainCategoryTitleKz: "-",
    hasChild: item.has_child,
  }));

const d = async () => {
  try {
    const count = await Category.count();
    console.log(`Количество категорий в базе: ${count}`);
    console.log(`Всего категорий для загрузки: ${categoriesData.length}`);

    const errors = [];

    for (const category of transformData(categoriesData)) {
      try {
        await Category.create(category); // Создаём категорию по одной
      } catch (error) {
        console.error(
          `Ошибка при создании категории ${category.titleRu}:`,
          error.message
        );
        errors.push({ category: category.titleRu, error: error.message });
      }
    }

    console.log("Категории успешно загружены в базу данных");

    if (errors.length > 0) {
      console.log("Ошибки при загрузке категорий:");
      console.table(errors);
    }
  } catch (error) {
    console.error("Глобальная ошибка при загрузке категорий:", error);
  }
};

d();
