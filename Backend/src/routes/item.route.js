const { Router } = require("express");
const { authUser } = require("../middleware/auth.middleware.js");
const { saveItem, getAllItems, getSingleItem, updateItem, deleteItem } = require("../controllers/item.controller.js");

const router = Router();

router.post("/save", authUser, saveItem);
router.get("/all", authUser, getAllItems);
router.get("/single/:id", authUser, getSingleItem);
router.put("/update/:id", authUser, updateItem);
router.delete("/delete/:id", authUser, deleteItem);

module.exports = router;