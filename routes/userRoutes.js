const express = require('express');
const router = express.Router();

// Controllers
const { registerUser, loginUser } = require('../controllers/userController');

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
