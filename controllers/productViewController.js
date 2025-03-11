const ProductViewService = require("../services/productViewService");

class ProductViewController {
  // 🔹 Логирование просмотра товара
  async logProductView(req, res) {
    try {
      console.log("Body:", req.body); // 👀 Отладка запроса

      const { productId, duration, source } = req.body;
      const ipAddress =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Получаем IP

      console.log("req.headers: ", req.headers);
      console.log("ipAddress: ", ipAddress);

      await ProductViewService.logView({
        productId,
        duration,
        source,
        ipAddress,
      });

      res.status(201).json({ success: true, message: "View logged" });
    } catch (error) {
      console.error("Error logging product view:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  // 🔹 Получение просмотров конкретного товара
  async getProductViews(req, res) {
    try {
      const { productId } = req.params;
      const views = await ProductViewService.getProductViews(productId);
      res.json({ success: true, data: views });
    } catch (error) {
      console.error("Error fetching product views:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  // 🔹 Получение статистики по источникам переходов
  async getProductViewStats(req, res) {
    try {
      const { productId } = req.params;
      const stats = await ProductViewService.getViewStats(productId);
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error("Error fetching product view stats:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
}

module.exports = new ProductViewController();
