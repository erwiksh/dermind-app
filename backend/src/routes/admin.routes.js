const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Manage Users (Admin Only)
router.get("/users", authMiddleware, adminMiddleware, adminController.getUsers);
router.delete("/users/:id", authMiddleware, adminMiddleware, adminController.deleteUser);

module.exports = router;
