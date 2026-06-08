const conexao = require('../database/database');

function listar(req, res) {
  // Lista clientes com dados do usuário.
  conexao.all(
    `SELECT
       clientes.id,
       usuarios.nome,
       usuarios.email,
       clientes.telefone,
       clientes.cpf
     FROM clientes
     JOIN usuarios ON usuarios.id = clientes.usuario_id
     ORDER BY usuarios.nome`,
    [],
    (erro, clientes) => {
      if (erro) {
        return res.status(500).json({ mensagem: 'Erro ao listar clientes.' });
      }

      return res.json(clientes);
    }
  );
}

function buscarPorId(req, res) {
  const { id } = req.params;

  conexao.get(
    `SELECT
       clientes.id,
       usuarios.nome,
       usuarios.email,
       clientes.telefone,
       clientes.cpf
     FROM clientes
     JOIN usuarios ON usuarios.id = clientes.usuario_id
     WHERE clientes.id = ?`,
    [id],
    (erro, cliente) => {
      if (erro) {
        return res.status(500).json({ mensagem: 'Erro ao buscar cliente.' });
      }

      if (!cliente) {
        return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
      }

      return res.json(cliente);
    }
  );
}

module.exports = {
  listar,
  buscarPorId
};
