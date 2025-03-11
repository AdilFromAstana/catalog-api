const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const categoryRoutes = require("./routes/categoryRoutes");
const businessTypeRoutes = require("./routes/businessTypeRoutes");
const productViewRoutes = require("./routes/productViewRoutes");
const attributeRoutes = require("./routes/attributeRoutes");
const businessRoutes = require("./routes/businessRoutes");
const typeRoutes = require("./routes/typeRoutes");
const itemRoutes = require("./routes/itemRoutes");
const setupSwagger = require("./swagger");

dotenv.config();
const app = express();

app.set("trust proxy", true); // ✅ Разрешает Express доверять `x-forwarded-for`
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/attributes", attributeRoutes);
app.use("/api/businessTypes", businessTypeRoutes);
app.use("/api/views", productViewRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/types", typeRoutes);
setupSwagger(app);

module.exports = app;
