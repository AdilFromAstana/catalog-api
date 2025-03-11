const express = require("express");
const router = express.Router();
const attributeController = require("../controllers/attributeController");

router.get("/getAll", attributeController.getAll);
router.get("/getById/:id", attributeController.getOne);
router.post("/create", attributeController.create);
router.put("/update/:id", attributeController.update);
router.delete("/delete/:id", attributeController.delete);

module.exports = router;
