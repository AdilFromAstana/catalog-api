const businessTypeService = require('../services/businessTypeService');

class BusinessTypeController {
    async getAll(req, res) {
        try {
            const businessTypes = await businessTypeService.getAll();
            res.json(businessTypes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOne(req, res) {
        try {
            const businessType = await businessTypeService.getById(req.params.id);
            if (!businessType) return res.status(404).json({ error: 'Тип бизнеса не найден' });
            res.json(businessType);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const businessType = await businessTypeService.create(req.body);
            res.status(201).json(businessType);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const businessType = await businessTypeService.update(req.params.id, req.body);
            res.json(businessType);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const message = await businessTypeService.delete(req.params.id);
            res.json(message);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new BusinessTypeController();