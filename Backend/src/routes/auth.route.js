const { Router } = require("express");
const { registerUser, loginUser, logoutUser, getMe } = require("../controllers/auth.controller");
const { authUser } = require("../middleware/auth.middleware");

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authUser, getMe);

module.exports = router;