import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { saveItem, getAllItems, getSingleItem, updateItem, deleteItem } from "../controllers/item.controller.js";

const router = Router();

router.post("/save", authUser, saveItem);
router.get("/all", authUser, getAllItems);
router.get("/single/:id", authUser, getSingleItem);
router.put("/update/:id", authUser, updateItem);
router.delete("/delete/:id", authUser, deleteItem);

export default router;