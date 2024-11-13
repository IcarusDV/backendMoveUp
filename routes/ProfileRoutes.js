const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Profile = require('../models/Profile');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Upload de imagens

// Listar perfil do usuário
router.get('/', authMiddleware, async (req, res) => {
  const profile = await Profile.findOne({ where: { userId: req.user.id } });
  res.json(profile);
});

// Atualizar perfil do usuário
router.put('/', authMiddleware, upload.single('profilePicture'), async (req, res) => {
  const { bio } = req.body;
  const profilePicture = req.file ? req.file.filename : null;

  const [updated] = await Profile.update(
    { bio, profilePicture },
    { where: { userId: req.user.id } }
  );

  if (updated) {
    const updatedProfile = await Profile.findOne({ where: { userId: req.user.id } });
    res.status(200).json(updatedProfile);
  } else {
    res.status(404).send('Perfil não encontrado');
  }
});

module.exports = router;
