const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyUser } = require('../controllers/authController');

// Rota para registro de usuário
router.post('/register', registerUser);

// Rota para login de usuário
router.post('/login', loginUser);

// Rota para verificar o código de verificação do usuário
router.post('/verify', verifyUser);

module.exports = router;
