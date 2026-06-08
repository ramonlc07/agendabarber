const conexao = require('../database/database');

function buscar(sql, dados = []) {
  return new Promise((resolve, reject) => {
    conexao.get(sql, dados, (erro, linha) => {
      if (erro) return reject(erro);
      return resolve(linha);
    });
  });
}

function listarSql(sql, dados = []) {
  return new Promise((resolve, reject) => {
    conexao.all(sql, dados, (erro, linhas) => {
      if (erro) return reject(erro);
      return resolve(linhas);
    });
  });
}

function executar(sql, dados = []) {
  return new Promise((resolve, reject) => {
    conexao.run(sql, dados, function (erro) {
      if (erro) return reject(erro);
      return resolve({ id: this.lastID, alterados: this.changes });
    });
  });
}

function dadosInvalidos(data_hora, servico_id, profissional_id) {
  return !data_hora || !servico_id || !profissional_id;
}

async function criar(req, res) {
  const { data_hora, servico_id, profissional_id } = req.body;

  if (dadosInvalidos(data_hora, servico_id, profissional_id)) {
    return res.status(400).json({ mensagem: 'Informe data, serviço e profissional.' });
  }

  try {
    const cliente = await buscar('SELECT id FROM clientes WHERE usuario_id = ?', [
      req.usuario.id
    ]);

    if (!cliente) {
      return res.status(403).json({ mensagem: 'Apenas clientes podem agendar.' });
    }

    const servico = await buscar('SELECT id FROM servicos WHERE id = ?', [servico_id]);

    if (!servico) {
      return res.status(404).json({ mensagem: 'Serviço não encontrado.' });
    }

    const profissional = await buscar(
      'SELECT id, disponivel FROM profissionais WHERE id = ?',
      [profissional_id]
    );

    if (!profissional) {
      return res.status(404).json({ mensagem: 'Profissional não encontrado.' });
    }

    if (profissional.disponivel !== 1) {
      return res.status(400).json({ mensagem: 'Profissional indisponível.' });
    }

    const conflito = await buscar(
      `SELECT id FROM agendamentos
       WHERE data_hora = ? AND profissional_id = ? AND status = ?`,
      [data_hora, profissional_id, 'Confirmado']
    );

    if (conflito) {
        return res.status(400).json({ mensagem: 'Horário já agendado.' });
    }

    const bloqueio = await buscar(
      'SELECT id FROM bloqueios_agenda WHERE data_hora = ? AND profissional_id = ?',
      [data_hora, profissional_id]
    );

    if (bloqueio) {
        return res.status(400).json({ mensagem: 'Horário bloqueado.' });
    }

    const resultado = await executar(
      `INSERT INTO agendamentos
       (data_hora, status, cliente_id, servico_id, profissional_id)
       VALUES (?, ?, ?, ?, ?)`,
      [data_hora, 'Confirmado', cliente.id, servico_id, profissional_id]
    );

    return res.status(201).json({
      mensagem: 'Agendamento criado com sucesso.',
      id: resultado.id
    });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao criar agendamento.' });
  }
}

async function listar(req, res) {
  try {
    const agendamentos = await listarSql(`
      SELECT
        agendamentos.id,
        agendamentos.data_hora,
        agendamentos.status,
        agendamentos.cliente_id,
        agendamentos.servico_id,
        agendamentos.profissional_id,
        usuarios.nome AS cliente_nome,
        servicos.nome AS servico_nome,
        profissionais.nome AS profissional_nome
      FROM agendamentos
      JOIN clientes ON clientes.id = agendamentos.cliente_id
      JOIN usuarios ON usuarios.id = clientes.usuario_id
      JOIN servicos ON servicos.id = agendamentos.servico_id
      JOIN profissionais ON profissionais.id = agendamentos.profissional_id
      ORDER BY agendamentos.data_hora
    `);

    return res.json(agendamentos);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao listar agendamentos.' });
  }
}

async function listarMeus(req, res) {
  try {
    const cliente = await buscar('SELECT id FROM clientes WHERE usuario_id = ?', [
      req.usuario.id
    ]);

    if (!cliente) {
      return res.status(403).json({ mensagem: 'Cliente não encontrado.' });
    }

    const agendamentos = await listarSql(
      `
        SELECT
          agendamentos.*,
          servicos.nome AS servico_nome,
          profissionais.nome AS profissional_nome
        FROM agendamentos
        JOIN servicos ON servicos.id = agendamentos.servico_id
        JOIN profissionais ON profissionais.id = agendamentos.profissional_id
        WHERE agendamentos.cliente_id = ?
        ORDER BY agendamentos.data_hora
      `,
      [cliente.id]
    );

    return res.json(agendamentos);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao listar agendamentos.' });
  }
}

async function cancelar(req, res) {
  const { id } = req.params;
  const dados = ['Cancelado', id, 'Confirmado'];
  let sql = 'UPDATE agendamentos SET status = ? WHERE id = ? AND status = ?';

  // Cliente cancela apenas os próprios; admin cancela qualquer um.
  if (req.usuario.tipo !== 'admin') {
    sql += ' AND cliente_id = (SELECT id FROM clientes WHERE usuario_id = ?)';
    dados.push(req.usuario.id);
  }

  try {
    const resultado = await executar(sql, dados);

    if (resultado.alterados === 0) {
      return res.status(404).json({ mensagem: 'Agendamento não encontrado.' });
    }

    return res.json({ mensagem: 'Agendamento cancelado com sucesso.' });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao cancelar agendamento.' });
  }
}

module.exports = {
  criar,
  listar,
  listarMeus,
  cancelar
};
