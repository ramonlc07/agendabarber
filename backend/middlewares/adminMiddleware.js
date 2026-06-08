function adminMiddleware(req, res, next) {
  // Verifica se existe usuário autenticado.
  if (!req.usuario) {
    return res.status(401).json({ mensagem: 'Usuário não autenticado.' });
  }

  // Libera apenas administradores.
  if (req.usuario.tipo !== 'admin') {
    return res.status(403).json({ mensagem: 'Acesso permitido só para admin.' });
  }

  next();
}

module.exports = adminMiddleware;
