const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/getAll", categoryController.getAll);
router.get("/getById/:id", categoryController.getOne);
router.get(
  "/getCategoriesByLevelAndParent",
  categoryController.getCategoriesByLevelAndParent
);
router.get(
  "/getCategoriesAndAttributesByLevelAndParent",
  categoryController.getCategoriesAndAttributesByLevelAndParent
);
router.get(
  "/getCategoryHierarchiesByIds",
  categoryController.getCategoryHierarchiesByIds
);
router.get(
  "/getCategoryHierarchiesByBusiness",
  categoryController.getCategoryHierarchiesByBusiness
);
router.post("/create", categoryController.create);
router.put("/update/:id", categoryController.update);
router.delete("/delete/:id", categoryController.delete);
router.patch(
  "/update/:id/attributes",
  categoryController.addOrUpdateAttributes
);

module.exports = router;
