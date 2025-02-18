const { Item } = require('../models');

class ItemService {
    async getAll() {
        return await Item.findAll();
    }

    async getById(id) {
        return await Item.findByPk(id);
    }

    async create(data) {
        return await Item.create(data);
    }

    async update(id, data) {
        const item = await Item.findByPk(id);
        if (!item) throw new Error('Товар не найден');
        return await item.update(data);
    }

    async delete(id) {
        const item = await Item.findByPk(id);
        if (!item) throw new Error('Товар не найден');
        await item.destroy();
        return { message: 'Товар удален' };
    }
}
module.exports = new ItemService();