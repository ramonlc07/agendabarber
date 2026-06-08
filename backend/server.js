const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const servicosRoutes = require('./routes/servicosRoutes');
const profissionaisRoutes = require('./routes/profissionaisRoutes');
const agendamentosRoutes = require('./routes/agendamentosRoutes');
const bloqueiosRoutes = require('./routes/bloqueiosRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
require('./database/initDB');

const app = express();
const porta = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/auth', authRoutes);
app.use('/servicos', servicosRoutes);
app.use('/profissionais', profissionaisRoutes);
app.use('/agendamentos', agendamentosRoutes);
app.use('/bloqueios', bloqueiosRoutes);
app.use('/clientes', clientesRoutes);

// Rota inicial do servidor.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
