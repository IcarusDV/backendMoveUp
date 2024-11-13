const axios = require('axios');

// Função para obter uma rota entre dois pontos
const getRoute = async (req, res) => {
  const { start, end } = req.query;

  const url = `https://api.mapbox.com/directions/v5/mapbox/cycling/${start};${end}?access_token=${process.env.MAPBOX_API_KEY}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter rota do Mapbox', error });
  }
};

module.exports = {
  getRoute,
};
