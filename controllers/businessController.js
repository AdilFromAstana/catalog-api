const businessService = require('../services/businessService');

class BusinessController {
    async getAll(req, res) {
        try {
            const businesses = await businessService.getAll();
            res.json(businesses);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOne(req, res) {
        try {
            const business = await businessService.getById(req.params.id);
            if (!business) return res.status(404).json({ error: 'Бизнес не найден' });
            res.json(business);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const business = await businessService.create(req.body);
            res.status(201).json(business);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const business = await businessService.update(req.params.id, req.body);
            res.json(business);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const message = await businessService.delete(req.params.id);
            res.json(message);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new BusinessController();