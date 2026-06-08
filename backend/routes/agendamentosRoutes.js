const express = require('express');
const router = express.Router();

const agendamentosController = require('../controllers/agendamentosController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rotas de agendamentos.
router.post('/', authMiddleware, agendamentosController.criar);
router.get('/', authMiddleware, adminMiddleware, agendamentosController.listar);
router.get('/meus', authMiddleware, agendamentosController.listarMeus);
router.patch('/:id/cancelar', authMiddleware, agendamentosController.cancelar);

module.exports = router;
