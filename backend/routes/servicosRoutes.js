const express = require('express');
const router = express.Router();

const servicosController = require('../controllers/servicosController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rotas de serviços.
router.get('/', servicosController.listar);
router.post('/', authMiddleware, adminMiddleware, servicosController.criar);
router.put('/:id', authMiddleware, adminMiddleware, servicosController.atualizar);
router.delete('/:id', authMiddleware, adminMiddleware, servicosController.remover);

module.exports = router;
