const Router = require("express");
const router = Router();
const businessTypeController = require("../controllers/businessTypeController");

router.get("/getAll", businessTypeController.getAll);
router.get("/getById/:id", businessTypeController.getOne);
router.post("/create", businessTypeController.create);
router.put("/update/:id", businessTypeController.update);
router.delete("/delete/:id", businessTypeController.delete);

module.exports = router;
