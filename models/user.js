const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');  // Importa a instância sequelize do db.js

// Definir o modelo User
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Usuário começa não verificado
  },
  verificationCode: {
    type: DataTypes.STRING, // Código de verificação enviado por email
    allowNull: true,
  },
});

module.exports = User;
