const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

router.get("/getAll", itemController.getAll);
router.get("/getById/:id", itemController.getOne);
router.post("/create", itemController.create);
router.put("/update/:id", itemController.update);
router.delete("/delete/:id", itemController.delete);

module.exports = router;
