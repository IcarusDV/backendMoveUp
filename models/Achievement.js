const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Achievement = sequelize.define('Achievement', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  icon: {
    type: DataTypes.STRING,
  },
});

module.exports = Achievement;
