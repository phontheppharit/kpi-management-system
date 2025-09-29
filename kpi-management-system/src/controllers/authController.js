const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/model");

// ---------------- REGISTER ----------------
exports.register = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // ตรวจสอบว่ามี user ซ้ำหรือยัง
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง user ใหม่
    const newUser = new User({
      username,
      email,
      password_hash: hashedPassword,
      role: role || "User", // ถ้าไม่ส่ง role จะ default = U
    });

    await newUser.save();

    res.status(201).json({
      msg: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ---------------- LOGIN ----------------
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // หา user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },       
      process.env.JWT_SECRET || "secretkey",   
      { expiresIn: "1h" }                      
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ---------------- GET USERS ----------------
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password_hash") 
      .populate("role_id", "name");

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
