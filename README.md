# AgendaBarber

Projeto acadêmico simples para gerenciar agendamentos de barbearia.

## Descrição
Aplicação Node.js + SQLite com frontend em HTML/CSS/JS (Bootstrap). Inclui backend em `backend/` e frontend em `frontend/`.

## Requisitos
- Node.js (>= 14)
- npm

## Instalação
1. Instale dependências:

```bash
npm install
```

2. Banco de dados: o projeto usa SQLite. O arquivo `barbearia.db` já pode existir, ou o backend inicializa conforme `backend/initDB.js`.

## Como rodar
- Iniciar backend:

```bash
node backend/server.js
```

- Frontend: abrir `frontend/index.html` no navegador ou executar o servidor estático se preferir:

```bash
node frontend/server.js
```

## Estrutura
- `backend/`: API e arquivos do servidor
- `frontend/`: páginas HTML, CSS, JS
- `barbearia.db`: banco SQLite (se existir)

## Contribuição
1. Faça um fork
2. Crie uma branch: `git checkout -b minha-melhoria`
3. Faça commits claros
4. Abra um Pull Request

## Licença
Projeto para fins acadêmicos — sem licença específica.

---
Arquivo criado automaticamente pelo assistente para documentar o projeto.# agendabarber
É um sistema de agendemantos voltado para procedimentos de barbearia.
