const express = require('express');
const { register, login, emailVerify, smsVerify, sendEmailSMS } = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/sms', smsVerify);
router.post('/email', emailVerify);
router.post('/login', login);
router.post('/sendES', sendEmailSMS);

module.exports = router;
