const express = require('express');
const User = require('../models/user'); // Importa o modelo de usuário
const router = express.Router();

// Rota para listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll(); // Obtém todos os usuários do banco de dados
    res.status(200).json(users); // Retorna os usuários em formato JSON
  } catch (error) {
    console.error('Erro ao listar usuários:', error); // Log do erro no console
    res.status(500).json({ error: 'Erro ao listar usuários' }); // Retorna mensagem de erro
  }
});

// Rota para criar um novo usuário
router.post('/', async (req, res) => {
  console.log('Dados recebidos:', req.body);
  const { username, password } = req.body; // Recebe os dados de username e password do corpo da requisição
  try {
    // Verificar se o username já existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    // Cria um novo usuário no banco de dados
    const newUser = await User.create({ username, password });
    res.status(201).json(newUser); // Retorna o novo usuário criado
  } catch (error) {
    console.error('Erro ao criar usuário:', error); // Log do erro no console
    res.status(500).json({ error: 'Erro ao criar usuário' }); // Retorna mensagem de erro
  }
});

module.exports = router;
