const express = require('express');
const validation = require('../middlewares/validation');
const { register, sendES, TFAsendES , loginTFA, login, verifyEmail, verifySMS } = require('../controllers/auth');
const { TFAverifySMS, TFAverifyEmail } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', validation, register);
router.post('/verifySMS', verifySMS);
router.post('/verifyEmail', verifyEmail);
router.post('/login', loginTFA);
router.post('/TFAverifySMS', TFAverifySMS, login);
router.post('/TFAverifyEmail', TFAverifyEmail, login);
router.post('/sendES', sendES);
router.post('/TFAsendES', TFAsendES);
    
module.exports = router;
