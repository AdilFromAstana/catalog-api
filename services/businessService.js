const { Business } = require('../models');

class BusinessService {
    async getAll() {
        return await Business.findAll();
    }

    async getById(id) {
        return await Business.findByPk(id);
    }

    async create(data) {
        return await Business.create(data);
    }

    async update(id, data) {
        const business = await Business.findByPk(id);
        if (!business) throw new Error('Бизнес не найден');
        return await business.update(data);
    }

    async delete(id) {
        const business = await Business.findByPk(id);
        if (!business) throw new Error('Бизнес не найден');
        await business.destroy();
        return { message: 'Бизнес удален' };
    }
}

module.exports = new BusinessService();