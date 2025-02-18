const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("catalog", "postgres", "postgres", {
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});
module.exports = sequelize;
