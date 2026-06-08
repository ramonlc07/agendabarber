const conexao = require('../database/database');

function listar(req, res) {
  // Lista bloqueios com nome do profissional.
  conexao.all(
    `SELECT
       bloqueios_agenda.*,
       profissionais.nome AS profissional_nome
     FROM bloqueios_agenda
     JOIN profissionais ON profissionais.id = bloqueios_agenda.profissional_id
     ORDER BY bloqueios_agenda.data_hora`,
    [],
    (erro, bloqueios) => {
      if (erro) {
        return res.status(500).json({ mensagem: 'Erro ao listar bloqueios.' });
      }

      return res.json(bloqueios);
    }
  );
}

function criar(req, res) {
  const { profissional_id, data_hora, motivo } = req.body;

  if (!profissional_id || !data_hora || !motivo) {
    return res.status(400).json({ mensagem: 'Informe profissional, data e motivo.' });
  }

  conexao.get(
    'SELECT id FROM profissionais WHERE id = ?',
    [profissional_id],
    (erro, profissional) => {
      if (erro) {
        return res.status(500).json({ mensagem: 'Erro ao buscar profissional.' });
      }

      if (!profissional) {
        return res.status(404).json({ mensagem: 'Profissional não encontrado.' });
      }

      verificarBloqueio(req, res);
    }
  );
}

function verificarBloqueio(req, res) {
  const { profissional_id, data_hora } = req.body;

  // Evita bloqueio duplicado no mesmo horário.
  conexao.get(
    'SELECT id FROM bloqueios_agenda WHERE profissional_id = ? AND data_hora = ?',
    [profissional_id, data_hora],
    (erro, bloqueio) => {
      if (erro) {
        return res.status(500).json({ mensagem: 'Erro ao verificar bloqueio.' });
      }

      if (bloqueio) {
        return res.status(400).json({ mensagem: 'Bloqueio já cadastrado neste horário.' });
      }

      salvarBloqueio(req, res);
    }
  );
}

function salvarBloqueio(req, res) {
  const { profissional_id, data_hora, motivo } = req.body;

  conexao.run(
    'INSERT INTO bloqueios_agenda (profissional_id, data_hora, motivo) VALUES (?, ?, ?)',
    [profissional_id, data_hora, motivo],
    function (erro) {
      if (erro) {
        return res.status(500).json({ mensagem: 'Erro ao criar bloqueio.' });
      }

      return res.status(201).json({
        mensagem: 'Bloqueio criado com sucesso.',
        id: this.lastID
      });
    }
  );
}

function remover(req, res) {
  const { id } = req.params;

  conexao.run('DELETE FROM bloqueios_agenda WHERE id = ?', [id], function (erro) {
    if (erro) {
      return res.status(500).json({ mensagem: 'Erro ao remover bloqueio.' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ mensagem: 'Bloqueio não encontrado.' });
    }

    return res.json({ mensagem: 'Bloqueio removido com sucesso.' });
  });
}

module.exports = {
  listar,
  criar,
  remover
};
