const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');  // Para envio de emails
const crypto = require('crypto');          // Para gerar códigos de verificação
const validator = require('validator');    // Para validar o email
const User = require('../models/user');

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Você pode usar outro serviço de email
  auth: {
    user: process.env.EMAIL_USER,         // Seu email
    pass: process.env.EMAIL_PASS,         // Sua senha ou chave de app
  },
});

// Função para registrar um usuário e enviar código de verificação por email
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar se o campo email é válido
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    // Verificar se o usuário já existe pelo username
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Verificar se o email já está em uso
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Gerar código de verificação
    const verificationCode = crypto.randomBytes(4).toString('hex'); // Código de 8 caracteres

    // Criar o novo usuário no banco de dados com status não verificado
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,                  // Adiciona campo para indicar se o usuário está verificado
      verificationCode,                   // Armazena o código de verificação
    });
    const welcomeMessage = (username, verificationCode) => `
Olá, ${username}!

Seja bem-vindo(a) à nossa plataforma! Estamos muito felizes em tê-lo(a) conosco.

Para concluir o seu cadastro e ativar sua conta, por favor, utilize o código de verificação abaixo:

Seu código de verificação é: ${verificationCode}

Insira este código no campo de verificação da nossa plataforma para ter acesso total às nossas funcionalidades.

Se você não fez este cadastro, por favor, desconsidere este email.

Atenciosamente,
Equipe de Suporte
`;

    // Enviar email com o código de verificação
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verificação Move Up',
      text: welcomeMessage(username, verificationCode),
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Usuário cadastrado com sucesso. Verifique seu email para ativar sua conta.' });
  } catch (error) {
    console.error('Erro ao registrar o usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário', error });
  }
};

// Função para verificar o código de verificação
const verifyUser = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    // Encontrar o usuário pelo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar se o código de verificação corresponde
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Código de verificação inválido.' });
    }

    // Atualizar o status do usuário para verificado
    user.isVerified = true;
    user.verificationCode = null; // Remover o código de verificação após o uso
    await user.save();

    res.json({ message: 'Usuário verificado com sucesso.' });
  } catch (error) {
    console.error('Erro ao verificar o usuário:', error);
    res.status(500).json({ message: 'Erro ao verificar usuário', error });
  }
};

// Função para fazer login do usuário com username ou email
const loginUser = async (req, res) => {
  const { identifier, password } = req.body; // 'identifier' pode ser username ou email

  try {
    // Verificar se o campo "identifier" foi preenchido
    if (!identifier) {
      return res.status(400).json({ message: 'Por favor, forneça o nome de usuário ou email.' });
    }

    // Verificar se é um email válido usando um verificador simples
    let user;
    if (validator.isEmail(identifier)) {
      user = await User.findOne({ where: { email: identifier } });
    } else {
      user = await User.findOne({ where: { username: identifier } });
    }

    if (!user) {
      return res.status(404).json({ message: 'Usuário ou email não encontrado.' });
    }

    // Verificar se o usuário está verificado
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Conta não verificada. Verifique seu email.' });
    }

    // Comparar senha com o hash armazenado
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    // Gerar o token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyUser,
};
