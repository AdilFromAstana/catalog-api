const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// 📌 API маршруты для категорий
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getOne);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);

module.exports = router;
