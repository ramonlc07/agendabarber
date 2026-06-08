const bcrypt = require('bcrypt');
const conexao = require('./database');

const senhaAdmin = bcrypt.hashSync('123456', 10);

conexao.serialize(() => {
  // Cria as tabelas principais.
  conexao.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      tipo TEXT NOT NULL
    )
  `);

  conexao.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telefone TEXT,
      cpf TEXT UNIQUE,
      usuario_id INTEGER NOT NULL UNIQUE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

  conexao.run(`
    CREATE TABLE IF NOT EXISTS servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco REAL NOT NULL,
      duracao INTEGER NOT NULL
    )
  `);

  conexao.run(`
    CREATE TABLE IF NOT EXISTS profissionais (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      especialidade TEXT,
      disponivel INTEGER NOT NULL DEFAULT 1
    )
  `);

  conexao.run(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data_hora TEXT NOT NULL,
      status TEXT NOT NULL,
      cliente_id INTEGER NOT NULL,
      servico_id INTEGER NOT NULL,
      profissional_id INTEGER NOT NULL,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id),
      FOREIGN KEY (servico_id) REFERENCES servicos(id),
      FOREIGN KEY (profissional_id) REFERENCES profissionais(id)
    )
  `);

  conexao.run(`
    CREATE TABLE IF NOT EXISTS bloqueios_agenda (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profissional_id INTEGER NOT NULL,
      data_hora TEXT NOT NULL,
      motivo TEXT,
      FOREIGN KEY (profissional_id) REFERENCES profissionais(id)
    )
  `);

  // Insere dados iniciais.
  conexao.run(
    `
      INSERT OR IGNORE INTO usuarios (nome, email, senha, tipo)
      VALUES (?, ?, ?, ?)
    `,
    ['Administrador', 'admin@barbearia.com', senhaAdmin, 'admin']
  );

  conexao.run(
    `
      INSERT OR IGNORE INTO servicos (id, nome, descricao, preco, duracao)
      VALUES (?, ?, ?, ?, ?)
    `,
    [1, 'Corte de cabelo', 'Corte simples masculino', 35.0, 40]
  );

  conexao.run(
    `
      INSERT OR IGNORE INTO servicos (id, nome, descricao, preco, duracao)
      VALUES (?, ?, ?, ?, ?)
    `,
    [2, 'Barba', 'Aparo e desenho da barba', 25.0, 30]
  );

  conexao.run(
    `
      INSERT OR IGNORE INTO profissionais (id, nome, especialidade, disponivel)
      VALUES (?, ?, ?, ?)
    `,
    [1, 'Joao', 'Corte masculino', 1]
  );

  conexao.run(
    `
      INSERT OR IGNORE INTO profissionais (id, nome, especialidade, disponivel)
      VALUES (?, ?, ?, ?)
    `,
    [2, 'Carlos', 'Barba e acabamento', 1],
    (erro) => {
      if (erro) {
        console.error('Erro ao inicializar o banco:', erro.message);
        return;
      }

      console.log('Banco inicializado com sucesso.');
    }
  );
});
