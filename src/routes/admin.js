const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const authMiddleware = require('../middlewares/auth');

router.post('/create', authMiddleware.verifyToken, adminController.createUser);
router.get('/', authMiddleware.verifyToken, adminController.getAllUsers);
router.get('/:id', authMiddleware.verifyToken, adminController.getUserById);
router.put('/:id', authMiddleware.verifyToken, adminController.updateUser);
router.delete('/:id', authMiddleware.verifyToken, adminController.deleteUser);

module.exports = router;
