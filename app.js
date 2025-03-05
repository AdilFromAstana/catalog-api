const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const categoryRoutes = require("./routes/categoryRoutes");
const businessTypeRoutes = require("./routes/businessTypeRoutes");
const businessRoutes = require("./routes/businessRoutes");
const typeRoutes = require("./routes/typeRoutes");
const itemRoutes = require("./routes/itemRoutes");
const setupSwagger = require("./swagger");

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/businessTypes", businessTypeRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/types", typeRoutes);
setupSwagger(app);

module.exports = app;
