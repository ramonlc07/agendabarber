const conexao = require('../database/database');

function dadosInvalidos(nome, preco, duracao) {
  const precoNumero = Number(preco);
  const duracaoNumero = Number(duracao);

  return (
    !nome ||
    Number.isNaN(precoNumero) ||
    Number.isNaN(duracaoNumero) ||
    precoNumero <= 0 ||
    duracaoNumero <= 0
  );
}

function listar(req, res) {
  // Lista todos os serviços cadastrados.
  conexao.all('SELECT * FROM servicos ORDER BY nome', [], (erro, servicos) => {
    if (erro) {
      return res.status(500).json({ mensagem: 'Erro ao listar serviços.' });
    }

    return res.json(servicos);
  });
}

function criar(req, res) {
  const { nome, descricao, preco, duracao } = req.body;

  // Valida dados principais.
  if (dadosInvalidos(nome, preco, duracao)) {
    return res.status(400).json({ mensagem: 'Informe nome, preço e duração válidos.' });
  }

  conexao.run(
    'INSERT INTO servicos (nome, descricao, preco, duracao) VALUES (?, ?, ?, ?)',
    [nome, descricao || null, Number(preco), Number(duracao)],
    function (erro) {
      if (erro) {
        return res.status(500).json({ mensagem: 'Erro ao criar serviço.' });
      }

      return res.status(201).json({
        mensagem: 'Serviço criado com sucesso.',
        id: this.lastID
      });
    }
  );
}

function atualizar(req, res) {
  const { id } = req.params;
  const { nome, descricao, preco, duracao } = req.body;

  if (dadosInvalidos(nome, preco, duracao)) {
    return res.status(400).json({ mensagem: 'Informe nome, preço e duração válidos.' });
  }

  conexao.run(
    'UPDATE servicos SET nome = ?, descricao = ?, preco = ?, duracao = ? WHERE id = ?',
    [nome, descricao || null, Number(preco), Number(duracao), id],
    function (erro) {
      if (erro) {
        return res.status(500).json({ mensagem: 'Erro ao atualizar serviço.' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ mensagem: 'Serviço não encontrado.' });
      }

      return res.json({ mensagem: 'Serviço atualizado com sucesso.' });
    }
  );
}

function remover(req, res) {
  const { id } = req.params;

  // Remove pelo id informado na rota.
  conexao.run('DELETE FROM servicos WHERE id = ?', [id], function (erro) {
    if (erro) {
      return res.status(500).json({ mensagem: 'Erro ao remover serviço.' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ mensagem: 'Serviço não encontrado.' });
    }

    return res.json({ mensagem: 'Serviço removido com sucesso.' });
  });
}

module.exports = {
  listar,
  criar,
  atualizar,
  remover
};
