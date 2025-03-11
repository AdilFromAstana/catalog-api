const express = require("express");
const ProductViewController = require("../controllers/productViewController");

const router = express.Router();

// Логирование просмотра товара
router.post("/log", ProductViewController.logProductView);

// Получение просмотров товара
router.get("/:productId", ProductViewController.getProductViews);

// Получение статистики по источникам переходов
router.get("/:productId/stats", ProductViewController.getProductViewStats);

module.exports = router;
