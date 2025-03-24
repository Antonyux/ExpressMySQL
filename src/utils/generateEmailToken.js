const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generates an email verification token
 * @param {string} userId - The user's ID
 * @returns {string} JWT token for email verification
 */
const generateEmailToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.EMAIL_SECRET, { expiresIn: '1h' });
};

module.exports = generateEmailToken;
