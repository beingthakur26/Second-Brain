import { Router } from "express";
import { registerUser, loginUser, logoutUser, getMe } from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authUser, getMe);

export default router;