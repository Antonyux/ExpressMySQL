const express = require('express');
const { register, login } = require('../controllers/auth'); // Ensure correct file name
const authMiddleware = require('../middlewares/auth'); // Ensure correct import

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

module.exports = router;
