// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {User} = require("../models/model");
const auth = require("../middleware/auth");

// GET all users (protected)
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // ไม่ส่ง password กลับ
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// UPDATE user role
router.put("/:id/role", auth, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE user
router.delete("/:id", auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
