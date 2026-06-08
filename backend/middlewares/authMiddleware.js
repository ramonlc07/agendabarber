const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Verifica se o token foi enviado.
  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não enviado.' });
  }

  const partes = authHeader.split(' ');

  // Espera o formato Bearer token.
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({ mensagem: 'Token inválido.' });
  }

  const token = partes[1];

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET || 'segredo_jwt');

    // Salva os dados do usuário autenticado.
    req.usuario = dados;
    next();
  } catch (erro) {
    return res.status(401).json({ mensagem: 'Token expirado ou inválido.' });
  }
}

module.exports = authMiddleware;
