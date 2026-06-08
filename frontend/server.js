const express = require('express');
const path = require('path');

const app = express();
const porta = 5500;

// Publica os arquivos do site.
app.use(express.static(__dirname));

// Abre a pagina inicial quando acessar localhost:5500.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(porta, () => {
  console.log(`Frontend rodando em http://localhost:${porta}`);
});
