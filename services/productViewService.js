const { Op } = require("sequelize");
const ProductView = require("../models/ProductView");

class ProductViewService {
  // Записываем просмотр
  async logView({ productId, duration, source, ipAddress }) {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Проверяем, был ли уже просмотр с этим IP и productId за последние 24 часа
    const existingView = await ProductView.findOne({
      where: {
        productId,
        ipAddress,
        viewedAt: { [Op.gt]: twentyFourHoursAgo },
      },
    });

    if (existingView) {
      console.log(
        `Просмотр товара ${productId} с IP ${ipAddress} уже был записан в последние 24 часа.`
      );
      return null; // Не создаем новую запись
    }

    return await ProductView.create({ productId, duration, source, ipAddress });
  }

  // Получаем все просмотры товара
  async getProductViews(productId) {
    return await ProductView.findAll({
      where: { productId },
      order: [["viewedAt", "DESC"]],
    });
  }

  // Получаем статистику по источникам переходов
  async getViewStats(productId) {
    const stats = await ProductView.findAll({
      where: { productId },
      attributes: ["source", [sequelize.fn("COUNT", "source"), "count"]],
      group: ["source"],
    });

    return stats.map((stat) => ({
      source: stat.source,
      count: parseInt(stat.dataValues.count, 10),
    }));
  }
}

module.exports = new ProductViewService();
