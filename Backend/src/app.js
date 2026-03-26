import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import itemRoutes from "./routes/item.route.js";
import collectionRoutes from "./routes/collection.route.js";
import { initQdrant } from "./config/qdrant.js";
import searchRouter from "./routes/search.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5174", // frontend URL
    credentials: true, // IMPORTANT (since you're using cookies)
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/collection", collectionRoutes);

// inside your startServer or after db connect — add:
await initQdrant();

// with your other routes:
app.use("/api/search", searchRouter);

export default app;