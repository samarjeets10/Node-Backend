const express = require('express');
const verifyToken = require('../middlewares/auth.middleware')
const { registerUser, loginUser, logoutUser } = require('../controllers/auth.controller')
const { loginLimiter, registerLimiter } = require('../middlewares/rate-limit.middleware');

const router = express.Router();

// router definations :
router.post("/register", registerLimiter, registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/logout", verifyToken, logoutUser);

module.exports = router;