const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.verifyToken = (req, res, next) => {

  const token = req.cookies.authToken;

  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};