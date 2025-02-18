const typeService = require('../services/typeService');

class TypeController {
    async getAll(req, res) {
        try {
            const types = await typeService.getAll();
            res.json(types);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOne(req, res) {
        try {
            const type = await typeService.getById(req.params.id);
            if (!type) return res.status(404).json({ error: 'Тип не найден' });
            res.json(type);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const type = await typeService.create(req.body);
            res.status(201).json(type);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const type = await typeService.update(req.params.id, req.body);
            res.json(type);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const message = await typeService.delete(req.params.id);
            res.json(message);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TypeController();
