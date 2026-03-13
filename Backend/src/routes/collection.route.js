const { Router } = require("express");
const { authUser } = require("../middleware/auth.middleware.js");
const { createCollection, getAllCollections, getSingleCollection, updateCollection, deleteCollection } = require("../controllers/collection.controller.js");

const router = Router();

router.post("/create", authUser, createCollection);
router.get("/all", authUser, getAllCollections);
router.get("/single/:id", authUser, getSingleCollection);
router.patch("/update/:id", authUser, updateCollection);
router.delete("/delete/:id", authUser, deleteCollection);

module.exports = router;