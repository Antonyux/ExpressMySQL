const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, phone_verified: user.phone_verified, email_verified: user.email_verified }, // Payload
    process.env.JWT_SECRET,            // Secret Key
    { expiresIn: process.env.TOKEN_EXPIRATION } // Expiration
  );
};

module.exports = generateToken;
