const express = require('express');
const session = require('express-session');
const { connectDB, sequelize } = require('./config/db');
const authMiddleware = require('./middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();

// Middleware para JSON
app.use(express.json());
app.use(helmet()); // Proteção extra com headers HTTP

// Configurar sessões temporárias para dados da corrida
app.use(session({
  secret: process.env.SESSION_SECRET || 'corrida_secreta',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Limitar número de requisições para evitar ataques de força bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Conectar ao banco de dados MySQL
connectDB();
sequelize.sync().then(() => console.log('Modelos sincronizados com sucesso.')).catch((err) => console.error('Erro ao sincronizar modelos:', err));

// Documentação da API com Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Move Up API',
      version: '1.0.0',
      description: 'API para gerenciar corridas, usuários, perfis e conquistas',
    },
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Definir as rotas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/run', require('./routes/runRoutes'));
app.use('/api/profile', require('./routes/ProfileRoutes')); // Rotas de perfil
app.use('/api/achievements', require('./routes/achievementRoutes')); // Rotas de conquistas

// Servir arquivos de mídia (imagens e vídeos)
app.use('/media', express.static('uploads'));

// Rota da página inicial (protegida)
app.get('/pagina_inicial', authMiddleware, (req, res) => {
  res.send(`Bem-vindo à página inicial, usuário ID: ${req.user.id}!`);
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Algo deu errado! Tente novamente.' });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
