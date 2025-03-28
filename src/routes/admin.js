const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { verifyToken } = require('../middlewares/auth');
const { verifyAdmin } = require('../middlewares/admin');

router.post('/create', verifyToken, adminController.createUser);
router.get('/', verifyToken, verifyAdmin, adminController.getUsers);
router.get('/:id', verifyToken, verifyAdmin, adminController.getUserById);
router.put('/:id', verifyToken, verifyAdmin, adminController.updateUser);
router.delete('/:id', verifyToken, verifyAdmin, adminController.deleteUser);

module.exports = router;
