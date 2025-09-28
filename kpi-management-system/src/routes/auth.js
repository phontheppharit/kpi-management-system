// src/routes/auth.js
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route (Admin only)
router.post("/create-user", auth, role(["Admin"]), register);


module.exports = router;

