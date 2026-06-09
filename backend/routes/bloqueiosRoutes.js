const express = require('express');
const router = express.Router();

const bloqueiosController = require('../controllers/bloqueiosController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rotas de bloqueios da agenda.
router.get('/', authMiddleware, adminMiddleware, bloqueiosController.listar);
router.post('/', authMiddleware, adminMiddleware, bloqueiosController.criar);
router.delete('/', authMiddleware, adminMiddleware, bloqueiosController.limpar);
router.delete('/:id', authMiddleware, adminMiddleware, bloqueiosController.remover);

module.exports = router;
