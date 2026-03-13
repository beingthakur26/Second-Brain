const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.route");
const itemRoutes = require("./routes/item.route");
const collectionRoutes = require("./routes/collection.route");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/collection", collectionRoutes);

module.exports = app;