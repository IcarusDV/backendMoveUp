const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user'); // Certifique-se de que o modelo de usuário está importado

// Definição do modelo Media para suportar fotos e vídeos
const Media = sequelize.define('Media', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mediaType: {
    type: DataTypes.ENUM('image', 'video'), // Define se é imagem ou vídeo
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Referência ao modelo User
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

// Define a relação entre Media e User
Media.belongsTo(User, { foreignKey: 'userId' });

module.exports = Media;
