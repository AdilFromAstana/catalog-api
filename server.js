const app = require("./app");
const sequelize = require("./db");
// const initializeData = require("./initData");

const PORT = 5000; // Порт для API

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
