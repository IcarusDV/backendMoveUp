const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Profile = sequelize.define('Profile', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  bio: {
    type: DataTypes.STRING,
  },
  profilePicture: {
    type: DataTypes.STRING,
  },
});

module.exports = Profile;
