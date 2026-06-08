const express = require('express');
const router = express.Router();

const clientesController = require('../controllers/clientesController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rotas administrativas de clientes.
router.get('/', authMiddleware, adminMiddleware, clientesController.listar);
router.get('/:id', authMiddleware, adminMiddleware, clientesController.buscarPorId);

module.exports = router;
