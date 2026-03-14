import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { createCollection, getAllCollections, getSingleCollection, updateCollection, deleteCollection } from "../controllers/collection.controller.js";

const router = Router();

router.post("/create", authUser, createCollection);
router.get("/all", authUser, getAllCollections);
router.get("/single/:id", authUser, getSingleCollection);
router.patch("/update/:id", authUser, updateCollection);
router.delete("/delete/:id", authUser, deleteCollection);

export default router;