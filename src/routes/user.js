const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const adminController = require('../controllers/admin');

const { verifyToken } = require('../middlewares/auth');
const { verifyAdmin } = require('../middlewares/admin');

router.put('/profile/update', verifyToken, userController.updateUserProfile);

router.post('/admin/create', verifyToken, adminController.createUser);
router.get('/admin/', verifyToken, verifyAdmin, adminController.getUsers);
router.get('/admin/:id', verifyToken, verifyAdmin, adminController.getUserById);
router.put('/admin/:id', verifyToken, verifyAdmin, adminController.updateUser);
router.delete('/admin/:id', verifyToken, verifyAdmin, adminController.deleteUser);

router.post('/logout', verifyToken, userController.logout);


module.exports = router;
