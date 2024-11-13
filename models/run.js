const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Run = sequelize.define('Run', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startLatitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  startLongitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  endLatitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  endLongitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  distance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  duration: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  pace: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  elevationGain: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

module.exports = Run;
