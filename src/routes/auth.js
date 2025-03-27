const express = require('express');
const { register, login, emailverify, smsverify } = require('../controllers/auth'); // Ensure correct file name

const router = express.Router();

router.post('/register', register);
router.post('/sms', smsverify);
router.post('/email', emailverify);
router.post('/login', login);

module.exports = router;
