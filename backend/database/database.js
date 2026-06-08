const sqlite3 = require('sqlite3').verbose();

// Abre ou cria o banco automaticamente.
const conexao = new sqlite3.Database('./barbearia.db', (erro) => {
  if (erro) {
    console.error('Erro ao conectar no banco:', erro.message);
    return;
  }

  console.log('Banco SQLite conectado.');
});

// Ativa o suporte a chaves estrangeiras.
conexao.run('PRAGMA foreign_keys = ON');

module.exports = conexao;
