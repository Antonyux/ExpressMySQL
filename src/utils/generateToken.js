const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, // Payload
    process.env.JWT_SECRET,            // Secret Key
    { expiresIn: process.env.TOKEN_EXPIRATION } // Expiration
  );
};

module.exports = generateToken;
