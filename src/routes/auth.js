const express = require('express');
const { register, login } = require('../controllers/auth');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: "You have access", user: req.user });
});

module.exports = router;
