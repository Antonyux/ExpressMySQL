const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // ✅ Check if authorization header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  // ✅ Extract token safely
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
