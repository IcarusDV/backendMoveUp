const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Achievement = require('../models/Achievement');

const router = express.Router();

// Listar todas as conquistas
router.get('/', authMiddleware, async (req, res) => {
  const achievements = await Achievement.findAll();
  res.json(achievements);
});

// Criar uma nova conquista
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, icon } = req.body;
  const achievement = await Achievement.create({ title, description, icon });
  res.status(201).json(achievement);
});

// Editar uma conquista
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, icon } = req.body;
  const [updated] = await Achievement.update(
    { title, description, icon },
    { where: { id: req.params.id } }
  );

  if (updated) {
    const updatedAchievement = await Achievement.findOne({ where: { id: req.params.id } });
    res.status(200).json(updatedAchievement);
  } else {
    res.status(404).send('Conquista não encontrada');
  }
});

// Excluir uma conquista
router.delete('/:id', authMiddleware, async (req, res) => {
  const deleted = await Achievement.destroy({ where: { id: req.params.id } });

  if (deleted) {
    res.status(204).send();
  } else {
    res.status(404).send('Conquista não encontrada');
  }
});

module.exports = router;
