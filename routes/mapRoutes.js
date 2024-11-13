const express = require('express');
const router = express.Router();
const { getRoute } = require('../controllers/mapController');

// Rota para obter direções entre dois pontos
router.get('/route', getRoute);

module.exports = router;
