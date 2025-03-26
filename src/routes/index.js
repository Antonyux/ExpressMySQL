const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./user');
const adminRoutes = require('./admin');

router.use('/api/auth', authRoutes);
router.use('/api/admin', adminRoutes);
router.use('/api/user', userRoutes);


module.exports = router;
