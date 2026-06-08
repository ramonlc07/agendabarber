const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const conexao = require('../database/database');

function register(req, res) {
  const { nome, email, senha, telefone, cpf } = req.body;

  // Valida campos básicos.
  if (!nome || !email || !senha || !telefone || !cpf) {
    return res.status(400).json({ mensagem: 'Preencha os campos obrigatórios.' });
  }

  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ mensagem: 'Email inválido.' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ mensagem: 'A senha deve ter no mínimo 6 caracteres.' });
  }

  conexao.get(
    'SELECT id FROM usuarios WHERE email = ?',
    [email],
    async (erro, usuario) => {
      if (erro) {
        return res.status(500).json({ mensagem: 'Erro ao buscar usuário.' });
      }

      if (usuario) {
        return res.status(400).json({ mensagem: 'Email já cadastrado.' });
      }

      try {
        const senhaHash = await bcrypt.hash(senha, 10);

        conexao.run(
          'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
          [nome, email, senhaHash, 'cliente'],
          function (erroUsuario) {
            if (erroUsuario) {
              return res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.' });
            }

            conexao.run(
              'INSERT INTO clientes (telefone, cpf, usuario_id) VALUES (?, ?, ?)',
              [telefone, cpf, this.lastID],
              (erroCliente) => {
                if (erroCliente) {
                  return res.status(500).json({ mensagem: 'Erro ao cadastrar cliente.' });
                }

                return res.status(201).json({
                  mensagem: 'Cliente cadastrado com sucesso.'
                });
              }
            );
          }
        );
      } catch (erroHash) {
        return res.status(500).json({ mensagem: 'Erro ao proteger a senha.' });
      }
    }
  );
}

function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Informe email e senha.' });
  }

  conexao.get(
    'SELECT id, nome, email, senha, tipo FROM usuarios WHERE email = ?',
    [email],
    async (erro, usuario) => {
      if (erro) {
        return res.status(500).json({ mensagem: 'Erro ao buscar usuário.' });
      }

      if (!usuario) {
        return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (!senhaCorreta) {
        return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
      }

      const token = jwt.sign(
        { id: usuario.id, tipo: usuario.tipo },
        process.env.JWT_SECRET || 'segredo_jwt',
        { expiresIn: '1d' }
      );

      return res.json({
        mensagem: 'Login realizado com sucesso.',
        token,
        tipo: usuario.tipo,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email
        }
      });
    }
  );
}

module.exports = {
  register,
  login
};
