const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authMiddleware = require('../middlewares/auth');

router.put('/profile/update', authMiddleware.verifyToken, userController.updateUserProfile);

module.exports = router;
