const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

router.get("/getAll", itemController.getAll);
router.get("/getById/:id", itemController.getById);
router.get("/filterItems", itemController.filterItems);
router.get("/getItemsByCategory", itemController.getItemsByCategory);
router.get("/getCategoryFilters", itemController.getCategoryFilters);
router.get("/getFilteredItems", itemController.getFilteredItems);
router.get("/getAttributeCounts", itemController.getAttributeCounts);
router.post("/create", itemController.create);
router.put("/update/:id", itemController.update);
router.delete("/delete/:id", itemController.delete);

module.exports = router;
