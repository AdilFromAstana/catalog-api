const express = require("express");
const router = express.Router();
const typeController = require("../controllers/typeController");

router.get("/getAll", typeController.getAll);
router.get("/getById/:id", typeController.getOne);
router.post("/create", typeController.create);
router.put("/update/:id", typeController.update);
router.delete("/delete:id", typeController.delete);

module.exports = router;
