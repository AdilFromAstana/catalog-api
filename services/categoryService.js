const { Category } = require('../models');

class CategoryService {
    async getAllCategories() {
        return await Category.findAll();
    }

    async getCategoryById(id) {
        return await Category.findByPk(id);
    }

    async createCategory(data) {
        return await Category.create(data);
    }

    async updateCategory(id, data) {
        const category = await Category.findByPk(id);
        if (!category) {
            throw new Error('Категория не найдена');
        }
        return await category.update(data);
    }

    async deleteCategory(id) {
        const category = await Category.findByPk(id);
        if (!category) {
            throw new Error('Категория не найдена');
        }
        await category.destroy();
        return { message: 'Категория удалена' };
    }
}

module.exports = new CategoryService();
