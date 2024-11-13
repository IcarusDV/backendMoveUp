const { Sequelize } = require('sequelize');

// Conexão com o banco de dados MySQL usando Sequelize
const sequelize = new Sequelize('move_up_bd', 'root', 'I8zjRB!j', {
  host: 'localhost',
  dialect: 'mysql',
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o MySQL estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao MySQL:', error);
    process.exit(1); // Encerra a aplicação se não conseguir conectar
  }
};

// Exportar a instância sequelize
module.exports = { sequelize, connectDB };
