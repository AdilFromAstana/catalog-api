const express = require("express");
const router = express.Router();
const businessController = require("../controllers/businessController");

router.get("/getAll", businessController.getAll);
router.get("/getById/:id", businessController.getOne);
router.post("/create", businessController.create);
router.put("/update/:id", businessController.update);
router.delete("/delete/:id", businessController.delete);

module.exports = router;
