
const Router = require('express');
const router = Router();
const businessTypeController = require('../controllers/businessTypeController');

router.get('/', businessTypeController.getAll);
router.get('/:id', businessTypeController.getOne);
router.post('/', businessTypeController.create);
router.put('/:id', businessTypeController.update);
router.delete('/:id', businessTypeController.delete);

module.exports = router;