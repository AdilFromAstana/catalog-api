const Category = require("./models/Category");

const categoriesData = [
    {
        "id": 3203,
        "level": 3,
        "titleRu": "Масла и эфирные масла",
        "titleKz": "Майлар және эфир майлары",
        "commissionStart": 12,
        "commissionEnd": 12,
        "parentId": 3204,
        "parentTitleRu": "Товары для ароматерапии",
        "parentTitleKz": "Ароматерапияға арналған тауарлар",
        "mainCategoryId": 165,
        "mainCategoryTitleRu": "Красота и здоровье",
        "mainCategoryTitleKz": "Сұлулық және денсаулық",
        "hasChild": false
    }
]





const d = async () => {
    try {
        const count = await Category.count();
        // if (count === 0) {
        await Category.bulkCreate(categoriesData);
        console.log('Категории успешно загружены в базу данных');
        // } else {
        //     console.log('Таблица Category уже содержит данные, загрузка пропущена.');
        // }
    } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
    }
}
d()