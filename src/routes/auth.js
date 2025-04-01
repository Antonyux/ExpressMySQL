const express = require('express');
const { body } = require('express-validator');
const { register, login, emailVerify, smsVerify, sendEmailSMS } = require('../controllers/auth');

const router = express.Router();

router.post(
    '/register',
    [
      body('email').isEmail().withMessage('Invalid email'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ], register);
  

router.post('/sms', smsVerify);
router.post('/email', emailVerify);
router.post('/login', login);
router.post('/sendES', sendEmailSMS);
  
module.exports = router;
