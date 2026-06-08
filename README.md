# AgendaBarber

Este é o meu projeto acadêmico para gerenciar agendamentos de barbearia.

## Sobre este projeto
Criei uma aplicação simples com backend em Node.js e SQLite e um frontend em HTML/CSS/JS usando Bootstrap. O objetivo é demonstrar conceitos básicos de rotas, persistência com SQLite e interface mínima para clientes e administradores.

## Tecnologias
- Node.js
- Express
- SQLite
- HTML, Bootstrap, SASS, JavaScript puro

## Requisitos
- Node.js (>= 14)
- npm

## Instalação
1. Instale as dependências:

```bash
npm install
```

2. O banco é SQLite; caso não exista, a aplicação inicializa conforme `backend/initDB.js`.

## Como executar
- Iniciar o backend:

```bash
node backend/server.js
```

- Para testar o frontend localmente eu abro `frontend/index.html` no navegador ou executo o servidor estático:

```bash
node frontend/server.js
```

## Estrutura do projeto
- `backend/`: API e lógica do servidor
- `frontend/`: páginas HTML, CSS e JavaScript
- `barbearia.db`: arquivo SQLite (se presente)

## Desenvolvimento
1. Crie uma branch para suas alterações: `git checkout -b minha-melhoria`
2. Faça commits claros e pequenos
3. Envie um Pull Request

## Repositório
https://github.com/ramonlc07/agendabarber

## Observações
Projeto feito para fins acadêmicos; não inclui licença específica.

---
Arquivo atualizado para deixar o texto em primeira pessoa.
É um sistema de agendemantos voltado para procedimentos de barbearia.
