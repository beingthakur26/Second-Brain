// src/routes/search.routes.js

import express from "express";
import { semanticSearch, searchByTag } from "../controllers/search.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// all search routes require auth
router.use(authUser);

// GET /api/search?q=deep work productivity
router.get("/", semanticSearch);

// GET /api/search/tags?tag=javascript
router.get("/tags", searchByTag);

export default router;