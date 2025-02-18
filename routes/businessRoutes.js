const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');

router.get('/', businessController.getAll);
router.get('/:id', businessController.getOne);
router.post('/', businessController.create);
router.put('/:id', businessController.update);
router.delete('/:id', businessController.delete);

module.exports = router;
