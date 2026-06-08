const conexao = require('../database/database');

function disponivelInvalido(valor) {
  return valor !== 0 && valor !== 1;
}

function listar(req, res) {
  // Lista todos os profissionais cadastrados.
  conexao.all('SELECT * FROM profissionais ORDER BY nome', [], (erro, profissionais) => {
    if (erro) {
      return res.status(500).json({ mensagem: 'Erro ao listar profissionais.' });
    }

    return res.json(profissionais);
  });
}

function criar(req, res) {
  const { nome, especialidade, disponivel } = req.body;
  const estaDisponivel = disponivel === undefined ? 1 : Number(disponivel);

  if (!nome) {
    return res.status(400).json({ mensagem: 'Informe um nome válido.' });
  }

  if (Number.isNaN(estaDisponivel) || disponivelInvalido(estaDisponivel)) {
    return res.status(400).json({ mensagem: 'Disponível deve ser 0 ou 1.' });
  }

  conexao.run(
    'INSERT INTO profissionais (nome, especialidade, disponivel) VALUES (?, ?, ?)',
    [nome, especialidade || null, estaDisponivel],
    function (erro) {
      if (erro) {
        return res.status(500).json({ mensagem: 'Erro ao criar profissional.' });
      }

      return res.status(201).json({
        mensagem: 'Profissional criado com sucesso.',
        id: this.lastID
      });
    }
  );
}

function atualizar(req, res) {
  const { id } = req.params;
  const { nome, especialidade, disponivel } = req.body;
  const estaDisponivel = Number(disponivel);

  if (!nome) {
    return res.status(400).json({ mensagem: 'Informe um nome válido.' });
  }

  if (Number.isNaN(estaDisponivel) || disponivelInvalido(estaDisponivel)) {
    return res.status(400).json({ mensagem: 'Disponível deve ser 0 ou 1.' });
  }

  conexao.run(
    'UPDATE profissionais SET nome = ?, especialidade = ?, disponivel = ? WHERE id = ?',
    [nome, especialidade || null, estaDisponivel, id],
    function (erro) {
      if (erro) {
        return res.status(500).json({ mensagem: 'Erro ao atualizar profissional.' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ mensagem: 'Profissional não encontrado.' });
      }

      return res.json({ mensagem: 'Profissional atualizado com sucesso.' });
    }
  );
}

function remover(req, res) {
  const { id } = req.params;

  // Remove fisicamente por ser a opção mais simples neste projeto.
  conexao.run('DELETE FROM profissionais WHERE id = ?', [id], function (erro) {
    if (erro) {
      return res.status(500).json({ mensagem: 'Erro ao remover profissional.' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ mensagem: 'Profissional não encontrado.' });
    }

    return res.json({ mensagem: 'Profissional removido com sucesso.' });
  });
}

module.exports = {
  listar,
  criar,
  atualizar,
  remover
};
