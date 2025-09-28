// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const role = require("../middleware/role");
// const User = require("../models/model");

// // List users (Admin only)
// router.get("/", auth, async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// });


// // Update role (Admin only)
// router.put("/:id/role", auth, role(["Admin"]), async (req, res) => {
//   try {
//     const { role: newRole } = req.body;
//     if (!["Admin", "User"].includes(newRole)) {
//       return res.status(400).json({ msg: "Invalid role" });
//     }
//     const user = await User.findByIdAndUpdate(req.params.id, { role: newRole }, { new: true, select: "username role" });
//     if (!user) return res.status(404).json({ msg: "User not found" });
//     res.json(user);
//   } catch (e) {
//     res.status(500).json({ msg: e.message });
//   }
// });

// // Delete user (Admin only)
// router.delete("/:id", auth, role(["Admin"]), async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) return res.status(404).json({ msg: "User not found" });
//     res.json({ msg: "User deleted" });
//   } catch (e) {
//     res.status(500).json({ msg: e.message });
//   }
// });
// router.get("/", auth, getUsers);
// module.exports = router;


