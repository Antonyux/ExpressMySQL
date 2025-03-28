const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateEmailToken = (email) => {
    return jwt.sign({ email: email }, process.env.EMAIL_SECRET, { expiresIn: '1h' });
};

module.exports = generateEmailToken;
