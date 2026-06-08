const express = require('express');
const router = express.Router();

const profissionaisController = require('../controllers/profissionaisController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rotas de profissionais.
router.get('/', profissionaisController.listar);
router.post('/', authMiddleware, adminMiddleware, profissionaisController.criar);
router.put('/:id', authMiddleware, adminMiddleware, profissionaisController.atualizar);
router.delete('/:id', authMiddleware, adminMiddleware, profissionaisController.remover);

module.exports = router;
