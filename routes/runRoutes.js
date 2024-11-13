const express = require('express');
const geolib = require('geolib');
const Run = require('../models/run');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');

// Rota para iniciar a corrida
router.post('/start', authenticate, (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude e longitude são necessárias para iniciar a corrida.' });
  }

  req.session.runData = {
    startLatitude: latitude,
    startLongitude: longitude,
    startTime: Date.now(),
  };

  res.status(200).json({ message: 'Corrida iniciada com sucesso!' });
});

// Rota para finalizar a corrida e salvar no banco de dados
router.post('/finish', authenticate, async (req, res) => {
  const { latitude: endLatitude, longitude: endLongitude, elevationGain, duration } = req.body;

  if (!req.session.runData) {
    return res.status(400).json({ error: 'Nenhuma corrida foi iniciada.' });
  }

  const { startLatitude, startLongitude } = req.session.runData;

  // Calcular a distância
  const distance = geolib.getDistance(
    { latitude: startLatitude, longitude: startLongitude },
    { latitude: endLatitude, longitude: endLongitude }
  ) / 1000; // Distância em quilômetros

  // Calcular o pace (minutos por quilômetro), evitando divisão por zero
  let pace = 0;
  if (distance > 0) {
    pace = (duration / 60) / distance; // minutos por quilômetro
  }

  try {
    // Salvar a corrida no banco de dados
    const newRun = await Run.create({
      userId: req.user.id, // Supondo que você tenha o ID do usuário autenticado
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      distance,
      duration,
      pace,
      elevationGain: elevationGain || 0, // Se não houver elevação, usar 0
    });

    // Limpar os dados da sessão
    req.session.runData = null;

    res.status(201).json({ message: 'Corrida finalizada e salva com sucesso!', run: newRun });
  } catch (error) {
    console.error('Erro ao salvar a corrida:', error);
    res.status(500).json({ error: 'Erro ao salvar a corrida.' });
  }
});

// Rota para listar todas as corridas
router.get('/', authenticate, async (req, res) => {
  try {
    const runs = await Run.findAll({ where: { userId: req.user.id } }); // Obtém as corridas do usuário autenticado
    res.status(200).json(runs); // Retorna as corridas em formato JSON
  } catch (error) {
    console.error('Erro ao listar corridas:', error);
    res.status(500).json({ error: 'Erro ao listar corridas.' });
  }
});

module.exports = router;
