// src/middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "No Authorization header, access denied" });
  }

  
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : authHeader;

  if (!token) {
    return res.status(401).json({ msg: "No token provided, access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded); 
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.error("❌ JWT Error:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expired, please login again" });
    }
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
